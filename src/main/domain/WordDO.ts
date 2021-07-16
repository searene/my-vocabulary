import { WordStatus } from "../enum/WordStatus";
import { BaseDO } from "./BaseDO";
import { WordContextStep } from "./WordContextStep";
import { WordContext } from "./WordContext";

export type WordDO = BaseDO & {
  bookId: number;

  /**
   * the original word of the word shown in the book
   */
  originalWord: string;

  positions: number[];
  status: WordStatus;
};
