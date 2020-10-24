import { BaseDO } from "../do/BaseDO";
import { BaseQuery } from "../query/BaseQuery";
import { Options } from "../query/Options";
import { knex } from "./knex/KnexFactory";

export class RepositoryUtils {
  static async query<Q extends BaseQuery, D extends BaseDO>(
    tableName: string,
    query: Q,
    options?: Options
  ): Promise<D[]> {
    const queryInterface = knex.from(tableName).select(Object.keys(query));
    if (options !== undefined) {
      if (options.offset !== undefined) {
        queryInterface.offset(options.offset);
      }
      if (options.limit !== undefined) {
        queryInterface.limit(options.limit);
      }
    }
    queryInterface.where(query);
    // this.addQueryConditions(wordQuery, queryInterface);
    const rows = await queryInterface;
    return rows as D[];
  }
}