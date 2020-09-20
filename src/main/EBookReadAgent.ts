import { IEBookReader } from "./IEBookReader";
import { Optional } from "typescript-optional";
import { extname } from "path";
import { WordExtractor } from "./WordExtractor";

export class EBookReadAgent {
  private static readers: Map<
    string,
    new (filePath: string) => IEBookReader
  > = new Map();

  static register(ext: string, reader: new (filePath: string) => IEBookReader) {
    EBookReadAgent.readers.set(ext, reader);
  }

  static async readAllContents(filePath: string): Promise<Optional<string>> {
    const dotPlusExt = extname(filePath);
    if (dotPlusExt === "") {
      return Optional.empty();
    }
    const ext = dotPlusExt.substring(1); // remove the leading dot
    const Reader = EBookReadAgent.readers.get(ext);
    if (Reader === undefined) {
      return Optional.empty();
    }
    const reader = new Reader(filePath);
    await reader.init();
    const contents = await reader.readAll();
    return Optional.of(contents);
  }

  static async readAllWords(filePath: string): Promise<Map<string, number[]>> {
    const contents = await this.readAllContents(filePath);
    if (!contents.isPresent()) {
      return new Map();
    }
    const wordExtractor = new WordExtractor(contents.get());
    const words = new Map<string, number[]>();
    for (const word of wordExtractor) {
      if (words.has(word.word)) {
        const posList = words.get(word.word) as number[];
        posList.push(word.pos);
      } else {
        words.set(word.word, [word.pos]);
      }
    }
    return words;
  }
}
