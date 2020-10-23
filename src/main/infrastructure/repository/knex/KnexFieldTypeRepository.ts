import { injectable } from "@parisholley/inversify-async";
import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { FieldTypeRepository } from "../FieldTypeRepository";
import { knex } from "./KnexFactory";

@injectable()
export class KnexFieldTypeRepository implements FieldTypeRepository {
  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: FieldTypeDO): Promise<FieldTypeDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("field_types");
    if (!tablesExists) {
      await knex.schema.createTable("card_types", table => {
        table.increments();
        table.string("name");
        table.string("category");
      });
    }
  }
  async insert(dataObject: FieldTypeDO): Promise<FieldTypeDO> {
    throw new Error("Method not implemented.");
  }
  async batchInsert(dataObjects: FieldTypeDO[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(query: FieldTypeQuery): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(id: number[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
}
