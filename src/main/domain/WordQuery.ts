import { WordStatus } from "../enum/WordStatus";
import { BaseQuery } from "./BaseQuery";
import { WordStatusInDatabase } from "../enum/WordStatusInDatabase";

export type WordQuery = BaseQuery & {
  bookId?: number;
  word?: string;
  status?: WordStatus;
};
