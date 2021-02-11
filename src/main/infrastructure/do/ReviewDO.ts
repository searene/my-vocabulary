import { BaseDO } from "./BaseDO";

export type ReviewDO = BaseDO & {
  id?: number;
  cardInstanceId?: number;
  reviewTime?: Date;
  level?: Level;
  timeInterval?: string;
};
