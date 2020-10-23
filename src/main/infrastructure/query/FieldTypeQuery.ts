import { FieldTypeCategory } from "../common/FieldTypeCategory";
import { BaseQuery } from "./BaseQuery";

export type FieldTypeQuery = BaseQuery & {
  name?: number;
  category?: FieldTypeCategory;
  cardTypeId?: number;
};
