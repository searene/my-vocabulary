import { BaseQuery } from "./BaseQuery";

export type FieldQuery = BaseQuery & {
  fieldTypeId?: number;
  contents?: string;
  cardId?: number;
};
