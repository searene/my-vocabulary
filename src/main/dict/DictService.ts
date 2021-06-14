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
    if (resourceUrl.indexOf("speaker.svg") > -1) {
      console.log(`Get resource successfully, resourceUrl: ${resourceUrl}, contents: ${resource.toString()}`);
    }
    return Promise.resolve(resource);
  }

  getDictSpecificResourceUrl(dictId: number, resourceName: string): string {
    return DictParser.getDictSpecificResourceUrl(dictId, resourceName);
  }

  async getDictSpecificResource(dictId: number, resourceName: string): Promise<Buffer> {
    const resourceUrl = this.getDictSpecificResourceUrl(dictId, resourceName);
    return await this.getResource(resourceUrl);
  }

  static getResourceMimeType(resourceUrl: string): string {
    return DictParser.getResourceMimeType(resourceUrl);
  }

  static getResourceUrlProtocol(): string {
    return DictParser.getResourceUrlProtocol();
  }
}
