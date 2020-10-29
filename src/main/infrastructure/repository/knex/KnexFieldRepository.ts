import { injectable } from "@parisholley/inversify-async";
import { FieldDO } from "../../do/FieldDO";
import { FieldQuery } from "../../query/FieldQuery";
import { Options } from "../../query/Options";
import { FieldRepository } from "../FieldRepository";
import { RepositoryUtils } from "../RepositoryUtils";
import { knex } from "./KnexFactory";

@injectable()
export class KnexFieldRepository implements FieldRepository {
  private static readonly _FIELDS = "fields";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: FieldDO): Promise<FieldDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable(
      KnexFieldRepository._FIELDS
    );
    if (!tablesExists) {
      await knex.schema.createTable(KnexFieldRepository._FIELDS, (table) => {
        table.increments();
        table.string("contents");
        table.integer("card_id");
        table.integer("field_type_id");
      });
    }
  }
  async insert(fieldTypeDO: FieldDO): Promise<FieldDO> {
    return await RepositoryUtils.insert(
      KnexFieldRepository._FIELDS,
      fieldTypeDO
    );
  }
  async batchInsert(fieldDOs: FieldDO[]): Promise<FieldDO[]> {
    return await RepositoryUtils.batchInsert(
      KnexFieldRepository._FIELDS,
      fieldDOs
    );
  }
  async query(query: FieldQuery, options: Options): Promise<FieldDO[]> {
    return await RepositoryUtils.query(
      KnexFieldRepository._FIELDS,
      query,
      options
    );
  }
  async batchQueryByIds(id: number[]): Promise<FieldDO[]> {
    throw new Error("Method not implemented.");
  }
}
