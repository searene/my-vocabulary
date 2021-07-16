import { WordStatus } from "../enum/WordStatus";
import { BaseQuery } from "./BaseQuery";

export type WordQuery = BaseQuery & {
  bookId?: number;
  originalWord?: string;
  status?: WordStatus;
};
