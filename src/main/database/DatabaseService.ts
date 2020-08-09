import { WordQuery } from "../domain/WordQuery";
import { WordDO } from "../domain/WordDO";
import { BookQuery } from "../domain/BookQuery";
import { BookDO } from "../domain/BookDO";

export interface DatabaseService {
  init(): Promise<void>;

  /**
   * Insert book into the book table, return the inserted bookId.
   */
  writeBookContents(bookName: string, bookContents: string): Promise<number>;

  writeWords(
    bookId: number,
    wordAndPosList: Map<string, number[]>
  ): Promise<void>;

  queryWords(wordQuery: WordQuery): Promise<WordDO[]>;

  queryBooks(bookQuery: BookQuery): Promise<BookDO[]>;

  /**
   * Update a record on the table "words", based on the given id.
   * @returns the number of lines being changed.
   */
  updateWord(wordQuery: WordQuery): Promise<number>;
}
