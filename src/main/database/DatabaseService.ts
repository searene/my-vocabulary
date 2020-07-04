export interface DatabaseService {

  init(): Promise<void>;

  /**
   * Insert book into the book table, return the inserted bookId.
   */
  writeBookContents(bookName: string, bookContents: string): Promise<number>;

  writeWords(bookId: number, wordAndPosList: Map<string, number[]>): Promise<void>;

}