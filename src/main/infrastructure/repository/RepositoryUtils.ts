import { BaseDO } from "../do/BaseDO";
import { FieldDO } from "../do/FieldDO";
import { BaseQuery } from "../query/BaseQuery";
import { Options } from "../query/Options";
import { knex } from "./knex/KnexFactory";
import { CardInstanceDO } from "../do/CardInstanceDO";

export class RepositoryUtils {
  static async batchInsert<D extends BaseDO>(
    table: string,
    dataObjects: D[]
  ): Promise<D[]> {
    const ids = await knex(table).insert(dataObjects);
    const result: D[] = [];
    for (let i = 0; i < ids.length; i++) {
      const dataObject = { ...dataObjects[i] };
      dataObject.id = ids[i];
      result.push(dataObject);
    }
    return result;
  }
  static async query<Q extends BaseQuery, D extends BaseDO>(
    tableName: string,
    query: Q,
    options?: Options
  ): Promise<D[]> {
    const queryInterface = knex.from(tableName).select("*");
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

  static async queryCount<Q extends BaseQuery>(tableName: string, query: Q): Promise<number> {
    const queryInterface = knex
      .from(tableName)
      .count("*", {as: "cnt"})
      .where(query);
    const rows = await queryInterface;
    if (rows.length !== 1) {
      throw new Error("The size of rows must be 1, actual rows: " + rows);
    }
    return rows[0].cnt as number;
  }

  static async insert<D extends BaseDO>(
    tableName: string,
    dataObject: D
  ): Promise<D> {
    const dataObjectWithId = { ...dataObject };
    dataObjectWithId.id = await knex(tableName).insert(dataObject);
    return dataObjectWithId;
  }

  static async queryById<D extends BaseDO>(tableName: string, id: number) {
    const array = await RepositoryUtils.query(tableName, { id }, undefined);
    if (array.length > 1) {
      throw new Error(
        "array.length cannot be greater than 1, actual: " + array.length
      );
    } else if (array.length == 0) {
      return undefined;
    } else {
      return array[0];
    }
  }

  static async queryByIdOrThrow<D extends BaseDO>(
    tableName: string,
    id: number
  ) {
    const dataObject = await this.queryById(tableName, id);
    if (dataObject == undefined) {
      throw new Error(`Invalid id ${id} for table ${tableName}`);
    }
    return dataObject;
  }

  static async queryOne<Q extends BaseQuery, D extends BaseDO>
      (tableName: string, query: Q): Promise<D | undefined> {
    const dataObjects: D[] = await RepositoryUtils.query(tableName, query);
    if (dataObjects.length == 0) {
      return undefined;
    } else {
      return dataObjects[0];
    }
  }

  static async batchQueryByIds<D extends BaseDO>(
    table: string,
    ids: number[]
  ): Promise<D[]> {
    const queryBuilder = knex.from(table).select("*").whereIn("id", ids);
    return (await queryBuilder) as D[];
  }

  static async updateById<D extends BaseDO>(
    table: string,
    dataObject: D
  ): Promise<void> {
    await knex(table).where("id", dataObject.id).update(dataObject);
  }

  static async deleteById<D extends BaseDO>(
    table: string,
    id: number
  ): Promise<void> {
    await knex(table).where("id", id).delete();
  }

  static async delete<Q extends BaseQuery>(
    table: string,
    query: Q
  ): Promise<number> {
    return knex(table).where(query).delete();
  }
}
