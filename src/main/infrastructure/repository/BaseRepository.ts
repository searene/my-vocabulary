import { BaseQuery } from "../query/BaseQuery";
import { BaseDO } from "../do/BaseDO";
import { Options } from "../query/Options";

export interface BaseRepository<Q extends BaseQuery, D extends BaseDO> {
  init(): Promise<void>;

  insert(dataObject: D): Promise<D>;

  batchInsert(dataObjects: D[]): Promise<D[]>;

  query(query: Q, options?: Options): Promise<D[]>;

  batchQueryByIds(id: number[], options?: Options): Promise<D[]>;

  createTableIfNotExists(): Promise<void>;

  updateById(id: number, dataObject: D): Promise<D>;
}
