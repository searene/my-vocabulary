import { BaseQuery } from "../BaseQuery";
import { BaseWordQuery } from "./BaseWordQuery";

export type WordQuery = BaseWordQuery & {

  /**
   * Whether count original words.
   */
  countOriginalWord?: boolean;
};
