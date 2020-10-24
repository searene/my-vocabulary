import { injectable } from "@parisholley/inversify-async";
import { CompositionDO } from "../../do/CompositionDO";
import { CompositionQuery } from "../../query/CompositionQuery";
import { Options } from "../../query/Options";
import { CompositionRepository } from "../CompositionRepository";
import { RepositoryUtils } from "../RepositoryUtils";
import { knex } from "./KnexFactory";

@injectable()
export class KnexCompositionRepository implements CompositionRepository {
  private static readonly _COMPOSITIONS = "compositions";

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
    return RepositoryUtils.query(
      KnexCompositionRepository._COMPOSITIONS,
      query,
      options
    );
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
