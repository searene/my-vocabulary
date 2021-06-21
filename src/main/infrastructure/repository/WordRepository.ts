import { WordDO } from "../do/word/WordDO";
import { WordQuery } from "../query/WordQuery";
import { BaseRepository } from "./BaseRepository";
import { WordCount } from "../../domain/WordCount";
import { WordStatus } from "../../enum/WordStatus";
import { Options } from "../query/Options";

export interface WordRepository extends BaseRepository<WordQuery, WordDO> {
  updateByWord(wordDO: WordDO): Promise<WordDO[]>;

  updateWordStatus(): Promise<void>;

  getWordCount(bookId: number): Promise<WordCount>

  queryWordWithPositionsArray(query: WordQuery, options?: Options): Promise<WordWithPositions[]>;
}
