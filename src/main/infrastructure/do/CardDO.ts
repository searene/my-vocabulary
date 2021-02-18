import { BaseDO } from "./BaseDO";

export type CardDO = BaseDO & {
  cardTypeId?: number;
  bookId?: number;
  word?: string;
};
