import { injectable } from "@parisholley/inversify-async";
import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { Options } from "../../query/Options";
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
      await knex.schema.createTable("field_types", table => {
        table.increments();
        table.string("name");
        table.string("category");
        table.integer("card_type_id");
      });
    }
  }
  async insert(FieldTypeDO: FieldTypeDO): Promise<FieldTypeDO> {
    FieldTypeDO.id = await knex("field_types").insert(FieldTypeDO);
    return FieldTypeDO;
  }
  async batchInsert(dataObjects: FieldTypeDO[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(query: FieldTypeQuery, options: Options): Promise<FieldTypeDO[]> {
    const queryInterface = knex.from("field_types").select(Object.keys(query));
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
    return rows as FieldTypeDO[];
  }
  async batchQueryByIds(id: number[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
}
