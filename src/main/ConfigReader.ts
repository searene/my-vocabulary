import * as fs from "fs-extra";
import { join } from "path";
import { Optional } from "typescript-optional";
import { injectable } from "@parisholley/inversify-async";

@injectable()
export class ConfigReader {
  private config: any;

  private initialized: boolean = false;

  async init() {
    if (this.initialized) {
      return;
    }
    const configFilePath = join(__dirname, "..", "resources", "config.json");
    const rawFileContents = await fs.readFile(configFilePath);
    this.config = JSON.parse(rawFileContents.toString());
    this.initialized = true;
  }

  async getString(key: string): Promise<Optional<string>> {
    return Optional.ofNullable(this.config[key]);
  }

  async getBoolean(key: string): Promise<boolean> {
    return this.config[key];
  }

  async getPath(key: string): Promise<Optional<string>> {
    const value = await this.getString(key);
    if (value.isEmpty()) {
      return Optional.empty();
    }
    const dirs = value.get().split("/");
    return Optional.of(join(__dirname, ...dirs));
  }
}
