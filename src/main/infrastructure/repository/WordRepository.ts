import { WordDO } from "../do/word/WordDO";
import { WordQuery } from "../query/WordQuery";
import { BaseRepository } from "./BaseRepository";
import { WordCount } from "../../domain/WordCount";
import { WordStatus } from "../../enum/WordStatus";
import { Options } from "../query/Options";

export interface WordRepository extends BaseRepository<WordQuery, WordDO> {
  updateByOriginalWord(wordDO: WordDO): Promise<void>;

  updateStatusByBookIdAndOriginalWord(bookId: number, originalWord: string, status: WordStatus): Promise<void>;

  getOriginalWordCount(bookId: number): Promise<WordCount>;

  queryWordWithPositionsArray(query: WordQuery, options?: Options): Promise<WordWithPositions[]>;

  queryOriginalWordWithPositionsArray(bookId: number, status: WordStatus, originalWord?: string, options?: Options): Promise<WordWithPositions[]>;

  query(query: WordQuery, options?: Options): Promise<WordDO[]>;
}
