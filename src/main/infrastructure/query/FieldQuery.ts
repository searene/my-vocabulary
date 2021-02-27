import { BaseQuery } from "./BaseQuery";

export type FieldQuery = BaseQuery & {
  fieldTypeId?: number;
  originalContents?: string;
  plainTextContents?: string;
  cardId?: number;
};
