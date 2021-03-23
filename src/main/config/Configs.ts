import * as path from "path";
import * as os from "os";
import { FileUtils } from "../utils/FileUtils";

export class Configs {

  private static _instance: Configs | undefined;
  private confDir: string = path.join(os.homedir(), ".my-vocabulary-release");

  static get(): Configs {
    if (this._instance == undefined) {
      this._instance = new Configs();
      this._instance.init();
    }
    return this._instance;
  }

  getConfDir = (): string => {
    return this.confDir;
  }

  getResourceDir = (): string => {
    return path.join(this.confDir, "resources")
  }

  private constructor() { }

  private init(): void {
    FileUtils.mkdirRecursivelyIfNotExistsSync(this.getResourceDir());
  }
}
