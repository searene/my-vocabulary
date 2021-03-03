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
import { getPositionsAsNumberArray, WordDO } from "./infrastructure/do/WordDO";
import { ImportKnownWordsService } from "./import/ImportKnownWordsService";

@injectable()
export class WordServiceImpl implements WordService {

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
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    const wordDOList = await wordRepo.query({
      bookId,
      status: wordStatus,
      word,
    }, {
      offset: (pageNo - 1) * pageSize,
      limit: pageSize
    })
    return wordDOList.map((wordDO) => {
      return {
        id: wordDO.id as number,
        word: wordDO.word as string,
        originalWord: wordDO.originalWord as string,
        contextList: WordContextService.getContextList(
          wordDO.word as string,
          getPositionsAsNumberArray(wordDO.positions as string),
          bookDO.contents as string,
          contextStep,
          contextLimit
        ),
        status: wordDO.status as WordStatus,
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
