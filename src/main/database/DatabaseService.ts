import { WordQuery } from "../domain/WordQuery";
import { WordDO } from "../domain/WordDO";
import { WordCount } from "../domain/WordCount";

export interface DatabaseService {
  init(): Promise<void>;

  writeWords(
    bookId: number,
    wordAndPosList: Map<string, number[]>
  ): Promise<void>;

  queryWords(wordQuery: WordQuery): Promise<WordDO[]>;

  /**
   * Update a record on the table "words", based on the given id.
   * @returns the number of lines being changed.
   */
  updateWord(wordDO: WordDO): Promise<number>;

  /**
   * Calculate the count of words by status in a book.
   */
  getWordCount(bookId: number): Promise<WordCount>;
}
