import { BaseQuery } from "./BaseQuery";

export type BookQuery = BaseQuery & {
  name?: string;
  contents?: number;
};
