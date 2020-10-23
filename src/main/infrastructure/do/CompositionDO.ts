import { BaseDO } from "./BaseDO";

export type CompositionDO = BaseDO & {
  name?: string;
  cardTypeId?: number;
  front?: string;
  back?: string;
};
