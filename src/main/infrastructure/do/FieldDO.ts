import { BaseDO } from "./BaseDO";

export type FieldDO = BaseDO & {
  fieldTypeId?: number;
  originalContents?: string;
  plainTextContents: string;
  cardId?: number;
};
