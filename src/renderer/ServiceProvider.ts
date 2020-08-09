import { BookService } from "../main/BookService";
import { BookVO } from "../main/domain/BookVO";
import { Utils } from "./utils/Utils";
import { WordService } from "../main/WordService";
import { WordStatus } from "../main/enum/WordStatus";
import { WordVO } from "../main/database/WordVO";

interface ServiceProvider {
  bookService: BookService;
  wordService: WordService;
}

let serviceProvider: ServiceProvider;
if (process.env.RENDERER_ENV === "electron") {
  const mainJs = require("electron").remote.require("./main.js");

  serviceProvider = {
    bookService: mainJs.bookService,
    wordService: mainJs.wordService,
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
          totalWordCount: 123409128,
        };
      },
      async getBooks(): Promise<BookVO[]> {
        const bookVO1 = {
          id: 1,
          name: "Test Book",
          totalWordCount: 1125479,
        };
        const bookVO2 = {
          id: 2,
          name: "Another Test Book",
          totalWordCount: 1209412804,
        };
        return Promise.resolve([bookVO1, bookVO2]);
      },
      async getBook(): Promise<BookVO> {
        return Promise.resolve({
          id: 1,
          name: "Test Book",
          totalWordCount: 1125479,
        });
      },
    },

    wordService: {
      async getWords(): Promise<WordVO[]> {
        return [
          {
            id: 1,
            word: "tests",
            originalWord: "test",
            contextList: [
              {
                short: {
                  startPos: 10,
                  wordPos: 20,
                  endPos: 50,
                  contents: "This is just a simple test",
                },
                long: {
                  startPos: 10,
                  wordPos: 20,
                  endPos: 50,
                  contents: "This is just a simple test",
                },
              },
            ],
            status: WordStatus.Unknown,
          },
        ];
      },
      async updateWord(): Promise<void> {
        console.log("mock update");
        return Promise.resolve();
      },
      async getWordCount() {
        return Promise.resolve({
          unknown: 10,
          known: 1234,
        });
      },
    },
  };
}
export default serviceProvider;
