import { FieldTypeCategory } from "../common/FieldTypeCategory";
import { BaseDO } from "./BaseDO";

export type FieldTypeDO = BaseDO & {
  id?: number;
  name?: string;
  category?: FieldTypeCategory;
};
