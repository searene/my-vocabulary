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
import { WordDO } from "./domain/WordDO";
import { container } from "./config/inversify.config";
import { BookRepository } from "./infrastructure/repository/BookRepository";
import { BookDO } from "./infrastructure/do/BookDO";

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
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO = await bookRepo.queryByIdOrThrow(bookId);
    let wordQuery: WordQuery = {
      bookId: bookId,
      status: wordStatus,
      pageNo: pageNo,
      word: word,
      pageSize: pageSize,
    };
    const wordDOList = await this.databaseService.queryWords(wordQuery);
    return wordDOList.map((wordDO) => {
      return {
        id: wordDO.id,
        word: wordDO.word,
        originalWord: wordDO.originalWord,
        contextList: WordContextService.getContextList(
          wordDO.word,
          wordDO.positions,
          bookDO.contents as string,
          contextStep,
          contextLimit
        ),
        status: wordDO.status,
      };
    });
  }

  async updateWord(wordDO: WordDO): Promise<void> {
    const updatedRecords = await this.databaseService.updateWord(wordDO);
    if (updatedRecords === 0) {
      console.error("Nothing was updated");
    }
  }

  async getWordCount(bookId: number): Promise<WordCount> {
    return await this.databaseService.getWordCount(bookId);
  }
}
