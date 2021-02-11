import { BaseDO } from "./BaseDO";

export type CardInstanceDO = BaseDO & {
  id?: number;
  cardId?: number;
  compositionId?: number;
  dueTime?: Date;
  bookId?: number;
};
