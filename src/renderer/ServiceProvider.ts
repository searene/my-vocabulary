import { BookService } from "../main/BookService";
import { BookVO } from "../main/domain/BookVO";
import { Utils } from "./utils/Utils";

interface ServiceProvider {
  bookService: BookService
}

let serviceProvider: ServiceProvider;
if (process.env.RENDERER_ENV === "electron") {

  const remote = require("electron");
  const mainJs = remote.require("./main.js");
  const bookService: BookService = mainJs.bookService;

  serviceProvider = {
    bookService: bookService,
  };

} else {

  serviceProvider = {

    bookService: {
      async addBook(filePath: string): Promise<BookVO> {
        console.log("mock addBook: " + filePath);
        await Utils.sleep(1000);
        return {
          id: 3,
          name: "A New Book",
          totalWordCount: 123409128
        };
      },
      async getBooks(): Promise<BookVO[]> {
        const bookVO1 = {
          id: 1,
          name: "Test Book",
          totalWordCount: 1125479
        };
        const bookVO2 = {
          id: 2,
          name: "Another Test Book",
          totalWordCount: 1209412804
        };
        return Promise.resolve([bookVO1, bookVO2]);
      }
    }

  };
}
export default serviceProvider;