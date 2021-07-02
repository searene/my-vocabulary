import { WordVO } from "./database/WordVO";
import { WordStatus } from "./enum/WordStatus";
import { WordQuery } from "./domain/WordQuery";
import { WordCount } from "./domain/WordCount";
import { WordContextStep } from "./domain/WordContextStep";
import { Optional } from "typescript-optional";
import { BaseWordQuery } from "./infrastructure/query/word/BaseWordQuery";
import { WordDO } from "./infrastructure/do/word/WordDO";
import { Options } from "./infrastructure/query/Options";

export interface WordService {
  getWords(
    bookId: number,
    word: string | undefined,
    wordStatus: WordStatus,
    pageNo: number,
    pageSize: number,
    contextStep: WordContextStep,
    contextLimit: number,
  ): Promise<WordVO[]>;

  updateWordStatus(bookId: number, word: string, status: WordStatus): Promise<void>;

  getWordCount(bookId: number): Promise<WordCount>;

  importKnownWords(words: string[]): Promise<void>;

  /**
   * @returns deleted records count
   */
  delete(bookId: number): Promise<number>

  query(query: WordQuery, options: Options): Promise<WordDO[]>

  upsert(wordDO: WordDO): Promise<WordDO>;
}
