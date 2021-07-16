import * as fs from "fs";
import { Interface, createInterface } from "readline";
import { Optional } from "typescript-optional";
import { WordFormLine } from "./domain/WordFormLine";
import { inject, injectable } from "@parisholley/inversify-async";
import { ConfigReader } from "./ConfigReader";
import { WatchDog } from "./WatchDog";
import { container } from "./config/inversify.config";

@injectable()
export class WordFormReader {
  private variousWordToOriginalWordMap: Map<string, string> = new Map();

  private initiated = false;

  private readlineInterface?: Interface;

  async getWordToOriginalWordMap(words: string[]): Promise<Map<string, string>> {
    const result: Map<string, string> = new Map();
    for (const word of words) {
      const originalWord = await this.getOriginalWord(word);
      result.set(word, originalWord);
    }
    return result;
  }

  async getOriginalWord(changedWord: string): Promise<string> {
    await this.init();
    if (!this.variousWordToOriginalWordMap.has(changedWord) ||
        this.variousWordToOriginalWordMap.get(changedWord) === undefined) {
      return changedWord;
    }
    return this.variousWordToOriginalWordMap.get(changedWord) as string;
  }

  public async init(): Promise<void> {
    if (this.initiated) {
      return;
    }
    const configReader = await container.getAsync(ConfigReader);
    const formsENPath = await configReader.getPath("formsENPath");
    if (formsENPath.isEmpty()) {
      throw new Error("formsENPath config is not available");
    }
    const fileStream = fs.createReadStream(formsENPath.get());
    this.readlineInterface = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    this.readlineInterface.on("line", line => {
      const wordFormLine = WordFormReader.parseLine(line);
      if (!wordFormLine.isPresent()) {
        return;
      }
      wordFormLine.get().changedWordList.forEach(changedWord => {
        this.variousWordToOriginalWordMap.set(
          changedWord,
          wordFormLine.get().originalWord
        );
      });
      this.variousWordToOriginalWordMap.set(
        wordFormLine.get().originalWord,
        wordFormLine.get().originalWord
      );
    });
    return new Promise(resolve => {
      this.readlineInterface!.on("close", () => {
        this.initiated = true;
        resolve();
      });
    });
  }

  private static parseLine(line: string): Optional<WordFormLine> {
    const words = line.split(/[,:]/).map(word => word.trim());
    if (words.length < 2) {
      return Optional.empty();
    }
    const wordFormLine: WordFormLine = new WordFormLine();
    [wordFormLine.originalWord] = words;
    for (let i = 1; i < words.length; i += 1) {
      wordFormLine.changedWordList.push(words[i]);
    }
    return Optional.of(wordFormLine);
  }
}
