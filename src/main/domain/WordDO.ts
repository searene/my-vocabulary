import { WordStatus } from "../enum/WordStatus";
import { BaseDO } from "./BaseDO";

export type WordDO = BaseDO & {
  bookId: number,

  /**
   * word shown in the book
   */
  word: string,

  /**
   * the original word of the word shown in the book
   */
  originalWord: string,

  positions: number[],
  status: WordStatus
}

export function getContextList(positions: number[],
                               bookContents: string,
                               contextStep: number): string[] {
  const contextList: string[] = [];
  for (const pos of positions) {
    const start = Math.min(0, pos - contextStep);
    const end = Math.min(bookContents.length, pos + contextStep);
    const context = bookContents.substring(start, end);
    contextList.push(context);
  }
  return contextList;
}
