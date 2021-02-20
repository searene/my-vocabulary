import { BaseQuery } from "../query/BaseQuery";
import { BaseDO } from "../do/BaseDO";
import { Options } from "../query/Options";

export interface BaseRepository<Q extends BaseQuery, D extends BaseDO> {
  init(): Promise<void>;

  insert(dataObject: D): Promise<D>;

  batchInsert(dataObjects: D[]): Promise<D[]>;

  query(query: Q, options?: Options): Promise<D[]>;

  queryOne(query: Q): Promise<D | undefined>;

  queryById(id: number): Promise<D | undefined>;

  queryByIdOrThrow(id: number): Promise<D>;

  batchQueryByIds(ids: number[]): Promise<D[]>;

  createTableIfNotExists(): Promise<void>;

  updateById(dataObject: D): Promise<void>;

  deleteById(id: number): Promise<void>;

  /**
   * @returns deleted records count
   */
  delete(query: Q): Promise<number>
}
