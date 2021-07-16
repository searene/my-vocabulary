import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { WordStatus } from "../../../enum/WordStatus";
import { WordDO } from "../../../infrastructure/do/word/WordDO";
import { WordService } from "../../../WordService";
import { Word } from "../../word/Word";

export class WordFactory {

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
    originalWord: string,
    wordWithPositions: string,
  ): Promise<Word> {
    const wordService = container.get<WordService>(types.WordService);
    const wordDOs = await wordService.query(
      {
        originalWord,
        status: WordStatus.KNOWN,
      },
      { limit: 1 }
    );
    const statusOfNewWord =
      wordDOs.length > 0 ? WordStatus.KNOWN : WordStatus.UNKNOWN;
    const wordDO = await wordService.upsert({
      bookId: bookId,
      status: statusOfNewWord,
      originalWord: originalWord,
      positions: wordWithPositions,
    });
    const result = this.fromWordDO(wordDO);
    return result;
  }

  fromWordDO(wordDO: WordDO): Word {
    return new Word(
      wordDO.id as number,
      wordDO.bookId as number,
      wordDO.originalWord as string,
      (wordDO.positions as string).split(",").map((pos) => parseInt(pos)),
      wordDO.status as WordStatus
    );
  }
}
