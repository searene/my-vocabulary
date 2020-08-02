import { WordVO } from "./database/WordVO";
import "reflect-metadata";
import { inject, injectable} from "inversify";
import { DatabaseService } from "./database/DatabaseService";
import { WordStatus } from "./enum/WordStatus";
import { BookStatus } from "./enum/BookStatus";
import { getContextList, WordDO } from "./domain/WordDO";
import { TYPES } from "./config/inversify.config";

@injectable()
export class WordService {

  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService) {

  }

  async getWords(bookId: number,
                 wordStatus: WordStatus,
                 pageNo: number,
                 pageSize: number,
                 contextStep: number): Promise<WordVO[]> {
    const bookDOList = await this.databaseService.queryBooks({
      id: bookId,
      status: BookStatus.Normal
    });
    if (bookDOList.length != 1) {
      throw new Error("The size of bookDOList must be 1");
    }
    const bookDO = bookDOList[0];
    const wordDOList = await this.databaseService.queryWords({
      bookId: bookId,
      status: wordStatus,
      pageNo: pageNo,
      pageSize: pageSize
    });
    return wordDOList.map(wordDO => {
      return {
        id: wordDO.id,
        word: wordDO.word,
        originalWord: wordDO.originalWord,
        contextList: getContextList(wordDO.positions, bookDO.contents, contextStep)
      };
    });
  }
}