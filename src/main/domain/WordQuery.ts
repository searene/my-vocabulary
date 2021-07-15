import { WordStatus } from "../enum/WordStatus";
import { BaseQuery } from "./BaseQuery";

export type WordQuery = BaseQuery & {
  bookId?: number;
  word?: string;
  originalWord?: string;
  status?: WordStatus;
};
