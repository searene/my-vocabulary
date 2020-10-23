import { CompositionDO } from "../../do/CompositionDO";
import { CompositionQuery } from "../../query/CompositionQuery";
import { CompositionRepository } from "../CompositionRepository";
import { knex } from "./KnexFactory";

export class KnexCompositionRepository implements CompositionRepository {
  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async insert(dataObject: CompositionDO): Promise<CompositionDO> {
    throw new Error("Method not implemented.");
  }
  async batchInsert(dataObjects: CompositionDO[]): Promise<CompositionDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(query: CompositionQuery): Promise<CompositionDO[]> {
    throw new Error("Method not implemented.");
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
        table.string("front_fields");
        table.string("back_fields");
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
