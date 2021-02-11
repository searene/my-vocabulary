import { BaseDO } from "./BaseDO";

export type CompositionDO = BaseDO & {
  name?: string;
  cardTypeId?: number;
  frontTypeIds?: string;
  backTypeIds?: string;
};
