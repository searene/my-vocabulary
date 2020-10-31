import { BaseDO } from "./BaseDO";

export type WordDO = BaseDO & {
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
};
