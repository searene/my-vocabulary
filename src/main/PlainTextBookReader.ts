import { IEBookReader } from "./IEBookReader";
import * as fs from "fs-extra";

export class PlainTextBookReader implements IEBookReader {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  init(): Promise<void> {
    return Promise.resolve();
  }

  readAll(): Promise<string> {
    return fs.readFile(this.filePath, "utf-8");
  }
}
