import { BaseQuery } from "./BaseQuery";

export type CardInstanceQuery = BaseQuery & {
  id?: number;
  cardId?: number;
  compositionId?: number;
};
