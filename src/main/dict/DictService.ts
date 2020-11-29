import { injectable } from "@parisholley/inversify-async";

const DictParser = require("../../../build/Release/DictParser.node");

@injectable()
export class DictService {
  async getSuggestedWords(word: string): Promise<string[]> {
    return Promise.resolve(DictParser.getSuggestedWords(word));
  }

  async getHtml(word: string): Promise<string> {
    return Promise.resolve(DictParser.getHtml(word));
  }

  /**
   * Get resource contents.
   */
  async getResource(url: string): Promise<Buffer> {
    return Promise.resolve(DictParser.getResource(url));
  }
}
