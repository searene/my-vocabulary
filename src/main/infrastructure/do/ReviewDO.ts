import { BaseDO } from "./BaseDO";
import { Level } from "../../domain/card/Level";

export type ReviewDO = BaseDO & {
  id?: number;
  cardInstanceId?: number;
  reviewTime?: number;
  level?: Level;
  timeInterval?: string;
};
