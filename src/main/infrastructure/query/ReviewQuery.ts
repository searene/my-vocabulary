import { BaseQuery } from "./BaseQuery";
import { Level } from "../../domain/card/Level";

export type ReviewQuery = BaseQuery & {
  id?: number;
  cardInstanceId?: number;
  reviewTime?: Date;
  level?: Level;
};
