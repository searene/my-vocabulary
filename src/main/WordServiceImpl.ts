import { WordVO } from "./database/WordVO";
import { inject, injectable } from "inversify";
import { DatabaseService } from "./database/DatabaseService";
import { WordStatus } from "./enum/WordStatus";
import { BookStatus } from "./enum/BookStatus";
import { TYPES } from "./config/types";
import { WordService } from "./WordService";
import { WordQuery } from "./domain/WordQuery";
import { WordCount } from "./domain/WordCount";
import { WordContextService } from "./WordContextService";
import { WordContextStep } from "./domain/WordContextStep";
import { IWordRepository } from "./database/entity/IWordRepository";
import { WordFormReader } from "./WordFormReader";

@injectable()
export class WordServiceImpl implements WordService {
  constructor(
    @inject(TYPES.DatabaseService) private databaseService: DatabaseService,
    @inject(TYPES.IWordRepository) private wordRepository: IWordRepository,
    @inject(WordFormReader) private wordFormReader: WordFormReader
  ) {}

  async getWords(
    bookId: number,
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
    const wordDOList = await this.wordRepository.find({
      bookId: bookId,
      status: wordStatus,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
    const wordVOList: WordVO[] = [];
    for (const wordDO of wordDOList) {
      const originalWord = await this.wordFormReader.getOriginalWord(
        wordDO.word
      );
      wordVOList.push({
        id: wordDO.id,
        word: wordDO.word,
        originalWord: originalWord.isPresent() ? originalWord.get() : "",
        contextList: WordContextService.getContextList(
          wordDO.word,
          wordDO.positions.split(",").map(parseInt),
          bookDO.contents,
          contextStep,
          contextLimit
        ),
        status: wordDO.status,
      });
    }
    return wordVOList;
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
