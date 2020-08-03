import { EBookReadAgent } from "./EBookReadAgent";
import { container } from "./config/inversify.config";
import { DatabaseService } from "./database/DatabaseService";
import { TYPES } from "./config/types";

export class BookService {

  /**
   * @param filePath absolute path of the EBook file
   * @return bookId
   */
  static async addBook(filePath: string): Promise<number> {
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
}