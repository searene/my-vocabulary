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
  async getResource(resourceUrl: string): Promise<Buffer> {
    return Promise.resolve(DictParser.getResource(resourceUrl));
  }

  static getResourceMimeType(resourceUrl: string): string {
    return DictParser.getResourceMimeType(resourceUrl);
  }

  static getResourceUrlProtocol(): string {
    return DictParser.getResourceUrlProtocol();
  }
}
