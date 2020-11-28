import { injectable } from "@parisholley/inversify-async";

const DictParser = require("../../../build/Release/DictParser.node");

@injectable()
export class DictService {
  getSuggestedWords(word: string): string[] {
    return DictParser.getSuggestedWords(word);
  }

  getHtml(word: string): string {
    return DictParser.getHtml(word);
  }
}
