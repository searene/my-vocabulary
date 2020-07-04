import * as fs from "fs";
import { Interface, createInterface } from "readline";
import { Optional } from "typescript-optional";
import { WordFormLine } from "./domain/WordFormLine";
import { singleton } from "tsyringe";

@singleton()
export class WordFormReader {
  private changedWordToOriginalWordMap: Map<string, string> = new Map();

  private initiated = false;

  private readonly readlineInterface: Interface;

  constructor(absFilePath: string) {
    const fileStream = fs.createReadStream(absFilePath);
    this.readlineInterface = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  }

  public getOriginalWord(changedWord: string): Optional<string> {
    if (!this.initiated) {
      throw new Error("WordFormReader.init() has to be called first.");
    }
    if (!this.changedWordToOriginalWordMap.has(changedWord)) {
      return Optional.empty();
    }
    return Optional.ofNullable(this.changedWordToOriginalWordMap.get(changedWord));
  }

  public async init(): Promise<void> {
    this.readlineInterface.on("line", line => {
      const wordFormLine = WordFormReader.parseLine(line);
      if (!wordFormLine.isPresent()) {
        return;
      }
      wordFormLine.get().changedWordList.forEach(changedWord => {
        this.changedWordToOriginalWordMap.set(changedWord, wordFormLine.get().originalWord);
      });
    });
    return new Promise((resolve, reject) => {
      this.readlineInterface.on("close", () => {
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
