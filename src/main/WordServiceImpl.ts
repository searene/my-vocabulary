import { WordVO } from "./database/WordVO";
import { injectable } from "@parisholley/inversify-async";
import { WordStatus } from "./enum/WordStatus";
import { types } from "./config/types";
import { WordService } from "./WordService";
import { WordCount } from "./domain/WordCount";
import { WordContextService } from "./WordContextService";
import { WordContextStep } from "./domain/WordContextStep";
import { container } from "./config/inversify.config";
import { BookRepository } from "./infrastructure/repository/BookRepository";
import { WordRepository } from "./infrastructure/repository/WordRepository";
import { WordDO } from "./infrastructure/do/word/WordDO";
import { ImportKnownWordsService } from "./import/ImportKnownWordsService";
import { ConfigRepository } from "./infrastructure/repository/ConfigRepository";
import { WordQuery } from "./domain/WordQuery";
import { Options } from "./infrastructure/query/Options";

@injectable()
export class WordServiceImpl implements WordService {

  async upsert(wordDO: WordDO): Promise<WordDO> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    return await wordRepo.upsert(wordDO);
  }

  async query(query: WordQuery, options: Options): Promise<WordDO[]> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    return await wordRepo.query(query, options);
  }

  async delete(bookId: number): Promise<number> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    return await wordRepo.delete({ bookId });
  }

  async getWords(
    bookId: number,
    word: string | undefined,
    status: WordStatus,
    pageNo: number,
    pageSize: number,
    contextStep: WordContextStep,
    contextLimit: number,
  ): Promise<WordVO[]> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO = await bookRepo.queryByIdOrThrow(bookId);
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    const options = { offset: (pageNo - 1) * pageSize, limit: pageSize };
    const originalWordWithPositionsArray = await wordRepo.queryOriginalWordWithPositionsArray(bookId, status, word, options);
    return originalWordWithPositionsArray.map((wordWithPositions) => {
      return {
        originalWord: wordWithPositions.originalWord,
        contextList: WordContextService.getContextList(
          wordWithPositions.positions,
          bookDO.contents as string,
          contextStep,
          contextLimit
        ),
        status,
      };
    });
  }

  async updateWordStatus(bookId: number, originalWord: string, status: WordStatus): Promise<void> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    if (status === WordStatus.SKIPPED) {
      await wordRepo.updateByOriginalWord({ bookId, originalWord, status });
    } else {
      await wordRepo.updateByOriginalWord({ originalWord, status });
    }
  }

  async getWordCount(bookId: number): Promise<WordCount> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    const configRepo = await container.getAsync<ConfigRepository>(types.ConfigRepository);
    const configContents = await configRepo.queryConfigContents();
    if (configContents === undefined) {
      throw new Error("Config is missing.");
    }
    return await wordRepo.getOriginalWordCount(bookId);
  }

  async importKnownWords(words: string[]): Promise<void> {
    const importKnownWordService = container.get<ImportKnownWordsService>(types.ImportKnownWordsService);
    return importKnownWordService.import(words);
  }
}
