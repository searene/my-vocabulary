import { BaseQuery } from "./BaseQuery";

export type WordQuery = BaseQuery & {
  bookId?: number;

  /**
   * word shown in the book
   */
  word?: string;

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

  /**
   * Whether count original words.
   */
  countOriginalWord?: boolean;
};
