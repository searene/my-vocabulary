import { BaseQuery } from "./BaseQuery";
import { BookType } from "../do/BookDO";

export type BookQuery = BaseQuery & {
  name?: string;
  contents?: number;
  type?: BookType;
};
