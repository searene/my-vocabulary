import { BaseQuery } from "../query/BaseQuery";
import { BaseDO } from "../do/BaseDO";

export interface BaseRepository<Q extends BaseQuery, D extends BaseDO> {
  init(): Promise<void>;

  insert(dataObject: D): Promise<D>;

  batchInsert(dataObjects: D[]): Promise<D[]>;

  query(query: Q): Promise<D[]>;

  batchQueryByIds(id: number[]): Promise<D[]>;

  createTableIfNotExists(): Promise<void>;

  updateById(id: number, dataObject: D): Promise<D>;
}
