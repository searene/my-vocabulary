import { BaseQuery } from "./BaseQuery";

export type CardQuery = BaseQuery & {
  cardTypeId?: number;
};
