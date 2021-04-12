import { BaseRepository } from "./BaseRepository";
import { CardInstanceQuery } from "../query/CardInstanceQuery";
import { CardInstanceDO } from "../do/CardInstanceDO";

export interface CardInstanceRepository
  extends BaseRepository<CardInstanceQuery, CardInstanceDO> {
  queryNextDueCardInstance(bookId: number): Promise<CardInstanceDO | undefined>;
  queryDueCardInstanceCount(bookId: number): Promise<number>;
}
