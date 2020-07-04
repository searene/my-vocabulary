export type WordVO = {

  id: number,

  /**
   * Word in the book.
   */
  word: string,

  /**
   * The original word of the word in the book.
   */
  originalWord: string,

  contextList: string[];

}