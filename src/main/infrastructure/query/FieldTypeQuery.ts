import { FieldTypeCategory } from "../common/FieldTypeCategory";
import { BaseQuery } from "./BaseQuery";

export type FieldTypeQuery = BaseQuery & {
  name?: number;
  cardTypeId?: number;
  category?: FieldTypeCategory;
};
