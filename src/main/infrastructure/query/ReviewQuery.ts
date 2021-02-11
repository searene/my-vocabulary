import { BaseQuery } from "./BaseQuery";

export type ReviewQuery = BaseQuery & {
  id?: number;
  cardInstanceId?: number;
  reviewTime?: Date;
  level?: Level;
};
