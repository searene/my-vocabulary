import { BaseQuery } from "../BaseQuery";
import { BaseWordQuery } from "./BaseWordQuery";

export type WordQuery = BaseWordQuery & {

  /**
   * Whether only count original words.
   */
  onlyCountOriginalWords?: boolean;
};
