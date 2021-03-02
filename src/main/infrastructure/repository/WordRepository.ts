import { WordDO } from "../do/WordDO";
import { WordQuery } from "../query/WordQuery";
import { BaseRepository } from "./BaseRepository";
import { WordCount } from "../../domain/WordCount";

export interface WordRepository extends BaseRepository<WordQuery, WordDO> {
  updateByWord(wordDO: WordDO): Promise<WordDO[]>;

  updateWordStatus(): Promise<void>;

  getWordCount(bookId: number): Promise<WordCount>
}
