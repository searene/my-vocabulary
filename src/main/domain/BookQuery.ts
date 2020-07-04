import { BaseQuery } from "./BaseQuery";
import { BookStatus } from "../enum/BookStatus";

export type BookQuery = BaseQuery & {
  name?: string;
  status?: BookStatus;
}