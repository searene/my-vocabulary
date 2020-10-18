import { BaseQuery } from "./BaseQuery";

export type CardTypeQuery = BaseQuery & {
  name?: string;
};
