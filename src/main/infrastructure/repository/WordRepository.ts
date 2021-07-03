import { WordDO } from "../do/word/WordDO";
import { WordQuery } from "../query/word/WordQuery";
import { BaseRepository } from "./BaseRepository";
import { WordCount } from "../../domain/WordCount";
import { WordStatus } from "../../enum/WordStatus";
import { Options } from "../query/Options";
import { BaseWordQuery } from "../query/word/BaseWordQuery";

export interface WordRepository extends BaseRepository<WordQuery, WordDO> {
  updateByWord(wordDO: WordDO): Promise<void>;

  updateStatusByBookIdAndOriginalWord(bookId: number, originalWord: string, status: WordStatus): Promise<void>;

  updateWordStatus(): Promise<void>;

  getWordCount(bookId: number): Promise<WordCount>;

  getOriginalWordCount(bookId: number): Promise<WordCount>;

  queryWordWithPositionsArray(query: WordQuery, options?: Options): Promise<WordWithPositions[]>;

  baseQuery(query: BaseWordQuery, options?: Options): Promise<WordDO[]>;
}
