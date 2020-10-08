import { BaseQuery } from "../query/BaseQuery";
import { BaseDO } from "../do/BaseDO";

export interface BaseRepository<Q extends BaseQuery, D extends BaseDO> {
  /**
   * Insert a record and return its id.
   */
  insert(dataObject: D): Promise<number>;

  query(query: Q): Promise<D[]>;
}
