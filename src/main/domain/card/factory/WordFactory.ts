import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { WordStatus } from "../../../enum/WordStatus";
import { WordDO } from "../../../infrastructure/do/WordDO";
import { WordRepository } from "../../../infrastructure/repository/WordRepository";
import { WordFormReader } from "../../../WordFormReader";
import { Word } from "../../word/Word";

export class WordFactory {
  private _wordFormReader: WordFormReader = container.get(WordFormReader);

  private static _instance?: WordFactory;

  private constructor() {}

  static get() {
    if (this._instance === undefined) {
      return new WordFactory();
    }
    return this._instance;
  }

  async createWord(
    bookId: number,
    word: string,
    positions: number[]
  ): Promise<Word> {
    const wordRepository: WordRepository = await container.getAsync(
      types.WordRepository
    );
    const wordDOs = await wordRepository.query({
      word: word,
      status: WordStatus.Known,
      limit: 1,
    });
    const statusOfNewWord =
      wordDOs.length > 0 ? WordStatus.Known : WordStatus.Unknown;
    const originalWord = await this._wordFormReader.getOriginalWord(word);
    const wordDO = await wordRepository.insert({
      bookId: bookId,
      word: word,
      status: statusOfNewWord,
      originalWord: originalWord.orElse(""),
      positions: positions.join(","),
    });
    const result = this.fromWordDO(wordDO);
    return result;
  }

  fromWordDO(wordDO: WordDO): Word {
    return new Word(
      wordDO.id as number,
      wordDO.bookId,
      wordDO.word,
      wordDO.originalWord,
      wordDO.positions.split(",").map(pos => parseInt(pos)),
      wordDO.status
    );
  }
}
