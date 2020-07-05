import * as fs from "fs-extra";
import { join } from "path";
import { Optional } from "typescript-optional";
import { singleton } from "tsyringe";

@singleton()
export class ConfigReader {

  private config: any;

  private initialized: boolean = false;

  async init() {
    if (this.initialized) {
      return;
    }
    const rawFileContents = await fs.readFile(join(__filename, "../resources/config.json"));
    this.config = rawFileContents.toJSON();
    this.initialized = true;
  }

  async getString(key: string): Promise<Optional<string>> {
    await this.init();
    return Optional.ofNullable(this.config[key]);
  }
}