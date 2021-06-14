import * as fs from "fs-extra";
import * as path from "path";
import { Configs } from "../config/Configs";
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

  static async saveBufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    const fd = await fs.open(filePath, 'w');
    await fs.write(fd, buffer, 0, buffer.length, 0);
    await fs.close(fd);
  }

  static getNewInternalFilePath(ext: string) {
    return path.join(Configs.get().getResourceDir(), Date.now().toString()) +
      "." +
      ext;
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

  /**
   * Get extension without the dot.
   */
  static getExt(filePath: string) {
    const extWithDot = path.extname(this.getFileName(filePath));
    const extSplit = extWithDot.split(".");
    return extSplit[1];
  }

  static getFileName(filePath: string) {
    return path.basename(filePath);
  }
}
