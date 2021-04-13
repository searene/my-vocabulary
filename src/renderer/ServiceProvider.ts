import { CardFacade } from "./../main/facade/CardFacade";
import { BookService } from "../main/BookService";
import { WordService } from "../main/WordService";
import { DictService } from "../main/dict/DictService";
import { ResourceService } from "../main/resource/ResourceService";
import { ConfigService } from "../main/facade/ConfigService";

interface ServiceProvider {
  bookService: BookService;
  wordService: WordService;
  cardFacade: CardFacade;
  dictService: DictService;
  resourceService: ResourceService;
  configService: ConfigService;
}

const mainJs = require("electron").remote.require("./main.js");
const serviceProvider: ServiceProvider = {
  bookService: mainJs.bookService,
  wordService: mainJs.wordService,
  cardFacade: mainJs.cardFacade,
  dictService: mainJs.dictService,
  resourceService: mainJs.resourceService,
  configService: mainJs.configService,
};
export default serviceProvider;
