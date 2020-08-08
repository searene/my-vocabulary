import { EBookReadAgent } from "./EBookReadAgent";
import { container } from "./config/inversify.config";
import { DatabaseService } from "./database/DatabaseService";
import { TYPES } from "./config/types";
import { BookVO } from "./domain/BookVO";
import { inject, injectable } from "inversify";
import { BookStatus } from "./enum/BookStatus";
import { BookService } from "./BookService";
import { BookDO } from "./domain/BookDO";

@injectable()
export class BookServiceImpl implements BookService {

  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService) {

  }

  /**
   * @param filePath absolute path of the EBook file
   * @return bookId
   */
  async addBook(filePath: string): Promise<BookVO> {
    const contents = await EBookReadAgent.readAllContents(filePath);
    if (!contents.isPresent()) {
      throw new Error("contents not available");
    }
    const words = await EBookReadAgent.readAllWords(filePath);

    const databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
    const bookId = await databaseService.writeBookContents("Ten Drugs", contents.get());
    await databaseService.writeWords(bookId, words);
    const bookDOList = await databaseService.queryBooks({
      id: bookId
    });
    if (bookDOList.length !== 1) {
      throw new Error("bookDOList.length is not 1, the actual value is" + bookDOList.length);
    }
    return BookServiceImpl.toBookVO(bookDOList[0]);
  }

  async getBooks(): Promise<BookVO[]> {
    const bookDOList = await this.databaseService.queryBooks({
      status: BookStatus.Normal
    });
    return bookDOList.map(bookDO => {
      return BookServiceImpl.toBookVO(bookDO);
    });
  }

  static toBookVO(bookDO: BookDO): BookVO {
    return {
      id: bookDO.id,
      name: bookDO.name,
      totalWordCount: bookDO.contents.split(/\s/).length
    }
  }
}