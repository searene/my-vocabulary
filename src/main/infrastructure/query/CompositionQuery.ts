import { BaseQuery } from "./BaseQuery";

export type CompositionQuery = BaseQuery & {
  name?: string;
  cardTypeId?: number;
  front?: string;
  back?: string;
};
