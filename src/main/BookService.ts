import { EBookReadAgent } from "./EBookReadAgent";
import { container } from "./config/inversify.config";
import { DatabaseService } from "./database/DatabaseService";
import { TYPES } from "./config/types";
import { BookVO } from "./domain/BookVO";
import { inject, injectable } from "inversify";
import { BookStatus } from "./enum/BookStatus";

@injectable()
export class BookService {

  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService) {

  }

  /**
   * @param filePath absolute path of the EBook file
   * @return bookId
   */
  async addBook(filePath: string): Promise<number> {
    const contents = await EBookReadAgent.readAllContents(filePath);
    if (!contents.isPresent()) {
      throw new Error("contents not available");
    }
    const words = await EBookReadAgent.readAllWords(filePath);

    const databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
    const bookId = await databaseService.writeBookContents("Ten Drugs", contents.get());
    await databaseService.writeWords(bookId, words);
    return bookId;
  }

  async getBooks(): Promise<BookVO[]> {
    const bookDOList = await this.databaseService.queryBooks({
      status: BookStatus.Normal
    });
    return bookDOList.map(bookDO => {
      return {
        name: bookDO.name,
        totalWordCount: bookDO.contents.split(/\s/).length
      }
    });
  }
}