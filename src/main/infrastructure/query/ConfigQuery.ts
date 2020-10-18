import { BaseQuery } from "./BaseQuery";

export type ConfigQuery = BaseQuery & {
  defaultCardTypeId?: number;
};
