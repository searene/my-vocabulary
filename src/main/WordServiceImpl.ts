import { WordVO } from "./database/WordVO";
import { inject, injectable } from "@parisholley/inversify-async";
import { DatabaseService } from "./database/DatabaseService";
import { WordStatus } from "./enum/WordStatus";
import { BookStatus } from "./enum/BookStatus";
import { types } from "./config/types";
import { WordService } from "./WordService";
import { WordQuery } from "./domain/WordQuery";
import { WordCount } from "./domain/WordCount";
import { WordContextService } from "./WordContextService";
import { WordContextStep } from "./domain/WordContextStep";
import { Optional } from "typescript-optional";

@injectable()
export class WordServiceImpl implements WordService {
  constructor(
    @inject(types.DatabaseService) private databaseService: DatabaseService
  ) {}

  async getWords(
    bookId: number,
    word: string | undefined,
    wordStatus: WordStatus,
    pageNo: number,
    pageSize: number,
    contextStep: WordContextStep,
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
    let wordQuery: WordQuery = {
      bookId: bookId,
      status: wordStatus,
      pageNo: pageNo,
      word: word,
      pageSize: pageSize,
    };
    const wordDOList = await this.databaseService.queryWords(wordQuery);
    return wordDOList.map(wordDO => {
      return {
        id: wordDO.id,
        word: wordDO.word,
        originalWord: wordDO.originalWord,
        contextList: WordContextService.getContextList(
          wordDO.word,
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
