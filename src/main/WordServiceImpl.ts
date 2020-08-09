import { WordVO } from "./database/WordVO";
import { inject, injectable } from "inversify";
import { DatabaseService } from "./database/DatabaseService";
import { WordStatus } from "./enum/WordStatus";
import { BookStatus } from "./enum/BookStatus";
import { getContextList } from "./domain/WordDO";
import { TYPES } from "./config/types";
import { WordService } from "./WordService";
import { WordQuery } from "./domain/WordQuery";
import { WordCount } from "./domain/WordCount";

@injectable()
export class WordServiceImpl implements WordService {
  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService
  ) {}

  async getWords(
    bookId: number,
    wordStatus: WordStatus,
    pageNo: number,
    pageSize: number,
    contextStep: number,
    contextLimit: number
  ): Promise<WordVO[]> {
    const bookDOList = await this.databaseService.queryBooks({
      id: bookId,
      status: BookStatus.Normal,
    });
    if (bookDOList.length != 1) {
      throw new Error("The size of bookDOList must be 1");
    }
    const bookDO = bookDOList[0];
    const wordDOList = await this.databaseService.queryWords({
      bookId: bookId,
      status: wordStatus,
      pageNo: pageNo,
      pageSize: pageSize,
    });
    return wordDOList.map(wordDO => {
      return {
        id: wordDO.id,
        word: wordDO.word,
        originalWord: wordDO.originalWord,
        contextList: getContextList(
          wordDO.positions,
          bookDO.contents,
          contextStep,
          contextLimit
        ),
        status: wordDO.status,
      };
    });
  }

  async updateWord(wordQuery: WordQuery): Promise<void> {
    const updatedRecords = await this.databaseService.updateWord(wordQuery);
    if (updatedRecords === 0) {
      console.error("Nothing was updated");
    }
  }

  async getWordCount(bookId: number): Promise<WordCount> {
    return await this.databaseService.getWordCount(bookId);
  }
}
