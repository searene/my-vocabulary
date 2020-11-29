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
    const resource: Buffer = DictParser.getResource(resourceUrl);
    // console.log("in nodeJS");
    // console.log(resource.length);
    // console.log(resource.readUInt8())
    return Promise.resolve(resource);
  }

  static getResourceMimeType(resourceUrl: string): string {
    return DictParser.getResourceMimeType(resourceUrl);
  }

  static getResourceUrlProtocol(): string {
    return DictParser.getResourceUrlProtocol();
  }
}
