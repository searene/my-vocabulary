import { CardFacade } from "./../main/facade/CardFacade";
import { BookService } from "../main/BookService";
import { WordService } from "../main/WordService";
import { DictService } from "../main/dict/DictService";

interface ServiceProvider {
  bookService: BookService;
  wordService: WordService;
  cardFacade: CardFacade;
  dictService: DictService;
}

const mainJs = require("electron").remote.require("./main.js");
const serviceProvider: ServiceProvider = {
  bookService: mainJs.bookService,
  wordService: mainJs.wordService,
  cardFacade: mainJs.cardFacade,
  dictService: mainJs.dictService,
};
export default serviceProvider;
