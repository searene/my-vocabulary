import { FieldTypeCategory } from "../common/FieldTypeCategory";
import { BaseQuery } from "./BaseQuery";

export type FieldTypeQuery = BaseQuery & {
  name?: string;
  category?: FieldTypeCategory;
  cardTypeId?: number;
};
