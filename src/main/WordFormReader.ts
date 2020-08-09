import * as fs from "fs";
import { Interface, createInterface } from "readline";
import { Optional } from "typescript-optional";
import { WordFormLine } from "./domain/WordFormLine";
import { inject, injectable } from "inversify";
import { ConfigReader } from "./ConfigReader";

@injectable()
export class WordFormReader {
  private variousWordToOriginalWordMap: Map<string, string> = new Map();

  private initiated = false;

  private readlineInterface?: Interface;

  public constructor(
    @inject(ConfigReader) private configReader: ConfigReader
  ) {}

  async getOriginalWord(changedWord: string): Promise<Optional<string>> {
    await this.init();
    if (!this.variousWordToOriginalWordMap.has(changedWord)) {
      return Optional.empty();
    }
    return Optional.ofNullable(
      this.variousWordToOriginalWordMap.get(changedWord)
    );
  }

  public async init(): Promise<void> {
    if (this.initiated) {
      return;
    }
    const formsENPath = await this.configReader.getPath("formsENPath");
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
