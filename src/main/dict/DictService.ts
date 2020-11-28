const DictParser = require("../../../build/Release/DictParser.node");

import { injectable } from "@parisholley/inversify-async";

@injectable()
export class DictService {
  hello() {
    return DictParser.hello();
  }
}
