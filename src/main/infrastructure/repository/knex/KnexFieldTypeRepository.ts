import { injectable } from "@parisholley/inversify-async";
import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { Options } from "../../query/Options";
import { FieldTypeRepository } from "../FieldTypeRepository";
import { RepositoryUtils } from "../RepositoryUtils";
import { knex } from "./KnexFactory";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";

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
  async batchQueryByIds(ids: number[]): Promise<FieldTypeDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexFieldTypeRepository._FIELD_TYPES,
      ids
    );
  }
  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(
      KnexFieldTypeRepository._FIELD_TYPES,
      id
    );
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexFieldTypeRepository._FIELD_TYPES,
      id
    );
  }
}
