import { injectable } from "@parisholley/inversify-async";
import { CompositionDO } from "../../do/CompositionDO";
import { CompositionQuery } from "../../query/CompositionQuery";
import { Options } from "../../query/Options";
import { CompositionRepository } from "../CompositionRepository";
import { knex } from "./KnexFactory";

@injectable()
export class KnexCompositionRepository implements CompositionRepository {
  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async insert(CompositionDO: CompositionDO): Promise<CompositionDO> {
    const insertedIds = await knex("compositions").insert(CompositionDO);
    if (insertedIds.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return (await this.query({ id: insertedIds[0] }))[0];
  }
  async batchInsert(dataObjects: CompositionDO[]): Promise<CompositionDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(
    query: CompositionQuery,
    options?: Options
  ): Promise<CompositionDO[]> {
    const queryInterface = knex.from("compositions").select(Object.keys(query));
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
    return rows as CompositionDO[];
  }
  async batchQueryByIds(id: number[]): Promise<CompositionDO[]> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("compositions");
    if (!tablesExists) {
      await knex.schema.createTable("compositions", table => {
        table.increments();
        table.string("name");
        table.integer("card_type_id");
        table.string("front");
        table.string("back");
      });
    }
  }
  async updateById(
    id: number,
    dataObject: CompositionDO
  ): Promise<CompositionDO> {
    throw new Error("Method not implemented.");
  }
}
