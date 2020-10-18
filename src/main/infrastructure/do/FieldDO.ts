import { BaseDO } from "./BaseDO";

export type FieldDO = BaseDO & {
  fieldTypeId?: number;
  contents?: string;
  cardId?: number;
};
