import { EBookReadAgent } from "./EBookReadAgent";
import { container } from "./config/inversify.config";
import { DatabaseService } from "./database/DatabaseService";
import { TYPES } from "./config/types";
import { BookVO } from "./domain/BookVO";
import { inject, injectable } from "inversify";
import { BookStatus } from "./enum/BookStatus";
import { BookService } from "./BookService";
import { BookDO } from "./domain/BookDO";
import * as path from "path";
import { Optional } from "typescript-optional";

@injectable()
export class BookServiceImpl implements BookService {
  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService
  ) {}

  /**
   * @param filePath absolute path of the EBook file
   * @return bookId
   */
  async addBook(filePath: string): Promise<BookVO> {
    const contents = await EBookReadAgent.readAllContents(filePath);
    if (!contents.isPresent()) {
      throw new Error("plainContents not available");
    }
    const words = await EBookReadAgent.readAllWords(filePath);

    const databaseService = container.get<DatabaseService>(
      TYPES.DatabaseService
    );
    const bookId = await databaseService.writeBookContents(
      path.parse(filePath).name,
      contents.get()
    );
    await databaseService.writeWords(bookId, words);
    const bookDOList = await databaseService.queryBooks({
      id: bookId,
    });
    if (bookDOList.length !== 1) {
      throw new Error(
        "bookDOList.length is not 1, the actual value is" + bookDOList.length
      );
    }
    return BookServiceImpl.toBookVO(bookDOList[0]);
  }

  async getBooks(): Promise<BookVO[]> {
    const bookDOList = await this.databaseService.queryBooks({
      status: BookStatus.Normal,
    });
    return bookDOList.map(bookDO => {
      return BookServiceImpl.toBookVO(bookDO);
    });
  }

  async getBook(bookId: number): Promise<BookVO> {
    const bookDOArray = await this.databaseService.queryBooks({
      id: bookId,
    });
    return bookDOArray.map(bookDO => BookServiceImpl.toBookVO(bookDO))[0];
  }

  async removeBook(bookId: number): Promise<void> {
    await this.databaseService.removeBook(bookId);
  }

  async getFirstBook(): Promise<Optional<BookVO>> {
    const bookDOList = await this.databaseService.queryBooks({
      pageNo: 1,
      pageSize: 1,
    });
    if (bookDOList.length === 0) {
      return Optional.empty();
    } else {
      return Optional.of(BookServiceImpl.toBookVO(bookDOList[0]));
    }
  }

  static toBookVO(bookDO: BookDO): BookVO {
    return {
      id: bookDO.id,
      name: bookDO.name,
      totalWordCount: bookDO.contents.split(/\s/).length,
    };
  }
}
