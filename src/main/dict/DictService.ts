const DictParser = require("../../../build/Release/DictParser.node");

export class DictService {
  getSuggestedWords(word: string): string[] {
    return DictParser.getSuggestedWords(word);
  }
}
