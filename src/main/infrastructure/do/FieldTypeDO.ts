import { FieldTypeCategory } from "../common/FieldTypeCategory";
import { BaseDO } from "./BaseDO";

export type FieldTypeDO = BaseDO & {
  name?: string;
  category?: FieldTypeCategory;
  cardTypeId?: number;
};
