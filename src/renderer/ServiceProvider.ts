import { CardFacade } from "./../main/facade/CardFacade";
import { BookService } from "../main/BookService";
import { WordService } from "../main/WordService";

interface ServiceProvider {
  bookService: BookService;
  wordService: WordService;
  cardFacade: CardFacade;
}

const mainJs = require("electron").remote.require("./main.js");
const serviceProvider: ServiceProvider = {
  bookService: mainJs.bookService,
  wordService: mainJs.wordService,
  cardFacade: mainJs.cardFacade,
};
export default serviceProvider;
