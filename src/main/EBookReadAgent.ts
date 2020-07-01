import { IEBookReader } from "./IEBookReader";
import { Optional } from "typescript-optional";
import { extname } from "path";

export class EBookReadAgent {
  private static readers: Map<string, new (filePath: string) => IEBookReader> = new Map();

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

  static async readAllWords(filePath: string): Promise<Set<string>> {
    const contents = await this.readAllContents(filePath);
    if (!contents.isPresent()) {
      return new Set();
    }
    return new Set(contents.get().split(/[\s↵"',:.]+/).map(word => word.trim().toLowerCase()));
  }
}