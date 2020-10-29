import { injectable } from "@parisholley/inversify-async";
import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { Options } from "../../query/Options";
import { FieldTypeRepository } from "../FieldTypeRepository";
import { RepositoryUtils } from "../RepositoryUtils";
import { knex } from "./KnexFactory";

@injectable()
export class KnexFieldTypeRepository implements FieldTypeRepository {
  private static readonly _FIELD_TYPES = "field_types";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: FieldTypeDO): Promise<FieldTypeDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("field_types");
    if (!tablesExists) {
      await knex.schema.createTable("field_types", (table) => {
        table.increments();
        table.string("name");
        table.string("category");
        table.integer("card_type_id");
      });
    }
  }
  async insert(fieldTypeDO: FieldTypeDO): Promise<FieldTypeDO> {
    return await RepositoryUtils.insert(
      KnexFieldTypeRepository._FIELD_TYPES,
      fieldTypeDO
    );
  }
  async batchInsert(dataObjects: FieldTypeDO[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(query: FieldTypeQuery, options: Options): Promise<FieldTypeDO[]> {
    return await RepositoryUtils.query(
      KnexFieldTypeRepository._FIELD_TYPES,
      query,
      options
    );
  }
  async batchQueryByIds(id: number[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
}
