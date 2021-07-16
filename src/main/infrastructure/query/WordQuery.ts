import { BaseQuery } from "./BaseQuery";

export type WordQuery = BaseQuery & {

  bookId?: number;

  /**
   * the original word of the word shown in the book
   */
  originalWord?: string;

  /**
   * positions separated by comma
   */
  positions?: string;

  /**
   * @see WordStatus
   */
  status?: number;
};
