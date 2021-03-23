import * as fs from "fs-extra";
import axios from "axios";

export class FileUtils {
  static async download(url: string, filePath: string): Promise<void> {
    return axios({ url, responseType: "stream" }).then(
      (response) =>
        new Promise<void>((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(filePath))
            .on("finish", () => resolve())
            .on("error", (e: Error) => reject(e));
        })
    );
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
