import * as path from "path";
import * as os from "os";
import { FileUtils } from "../../renderer/utils/FileUtils";
import * as fs from "fs-extra";

export class Configs {

  private static _instance: Configs | undefined;
  private static confDir: string = path.join(os.homedir(), ".my-vocabulary-dev");

  static get(): Configs {
    if (this._instance == undefined) {
      this.init();
      this._instance = new Configs();
    }
    return this._instance;
  }

  getConfDir = (): string => {
    return Configs.confDir;
  }

  private constructor() {}

  private static init(): void {
    if (!FileUtils.existsSync(this.confDir)) {
      fs.mkdirSync(this.confDir, {recursive: true});
    }
  }
}