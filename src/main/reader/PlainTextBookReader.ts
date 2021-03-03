import { IEBookReader } from "./IEBookReader";
import * as fs from "fs-extra";

export class PlainTextBookReader implements IEBookReader {

  constructor(private readonly filePath: string) { }

  init(): Promise<void> {
    return Promise.resolve();
  }

  readAll(): Promise<string> {
    return fs.readFile(this.filePath, "utf-8");
  }
}
