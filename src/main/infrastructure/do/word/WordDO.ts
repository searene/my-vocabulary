import { BaseDO } from "../BaseDO";

export type WordDO = BaseDO & {
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

export function getPositionsAsNumberArray(positions: string): number[] {
  return positions.split(",").map(pos => parseInt(pos));
}