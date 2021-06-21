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
import { getPositionsAsNumberArray, WordDO } from "./infrastructure/do/word/WordDO";
import { ImportKnownWordsService } from "./import/ImportKnownWordsService";

@injectable()
export class WordServiceImpl implements WordService {

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
    const wordWithPositionsArray = await wordRepo.queryWordWithPositionsArray({
      bookId,
      status: status,
      word,
      countOriginalWord: true,
    }, {
      offset: (pageNo - 1) * pageSize,
      limit: pageSize
    })
    return wordWithPositionsArray.map((wordWithPositions) => {
      return {
        word: wordWithPositions.word,
        originalWord: wordWithPositions.originalWord,
        contextList: WordContextService.getContextList(
          wordWithPositions.word as string,
          wordWithPositions.positions,
          bookDO.contents as string,
          contextStep,
          contextLimit
        ),
        status,
      };
    });
  }

  async updateWord(wordDO: WordDO): Promise<void> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    await wordRepo.updateById(wordDO);
  }

  async getWordCount(bookId: number): Promise<WordCount> {
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    return await wordRepo.getWordCount(bookId);
  }

  async importKnownWords(words: string[]): Promise<void> {
    const importKnownWordService = container.get<ImportKnownWordsService>(types.ImportKnownWordsService);
    return importKnownWordService.import(words);
  }
}
