import * as fs from "fs-extra";
import fetch from 'electron-fetch';
import { Readable } from 'stream'

export class FileUtils {
  static async download(url: string, filePath: string): Promise<void> {

    const res = await fetch(url);
    const fileStream = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
      if (typeof res.body === "string") {
        fileStream.write(res.body);
        fileStream.end();
      }
      const readableResponse = res.body as Readable;
      readableResponse.pipe(fileStream);
      readableResponse.on("error", reject);
      fileStream.on("finish", resolve);
    });
  }

  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.stat(filePath);
      return true;
    } catch (e) {
      if (e.code === "ENOENT") {
        return false;
      } else {
        throw e;
      }
    }
  }

  static existsSync(filePath: string): boolean {
    try {
      fs.statSync(filePath);
      return true;
    } catch (e) {
      if (e.code === "ENOENT") {
        return false;
      } else {
        throw e;
      }
    }
  }

  static mkdirRecursivelyIfNotExistsSync(filePath: string) {
    if (!this.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
  }
}
