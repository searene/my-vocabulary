import { WordStatus } from "../enum/WordStatus";
import { WordContext } from "../domain/WordContext";

export type WordVO = {

  /**
   * The original word of the word in the book.
   */
  originalWord: string;

  contextList: WordContext[];

  status: WordStatus;
};

