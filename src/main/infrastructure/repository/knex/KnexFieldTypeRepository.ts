import { injectable } from "@parisholley/inversify-async";
import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { Options } from "../../query/Options";
import { FieldTypeRepository } from "../FieldTypeRepository";
import { RepositoryUtils } from "../RepositoryUtils";
import { knex } from "./KnexFactory";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { table } from "html-to-text/lib/formatter";
import { FieldQuery } from "../../query/FieldQuery";
import { FieldDO } from "../../do/FieldDO";
import { CardQuery } from "../../query/CardQuery";
import { BookQuery } from "../../query/BookQuery";

@injectable()
export class KnexFieldTypeRepository implements FieldTypeRepository {
  private static readonly _FIELD_TYPES = "field_types";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(dataObject: FieldTypeDO): Promise<void> {
    await RepositoryUtils.updateById(
      KnexFieldTypeRepository._FIELD_TYPES,
      dataObject
    );
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

  async queryOne(query: FieldTypeQuery): Promise<FieldTypeDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexFieldTypeRepository._FIELD_TYPES,
      query);
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexFieldTypeRepository._FIELD_TYPES,
      id
    );
  }
  async delete(query: FieldTypeQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexFieldTypeRepository._FIELD_TYPES,
      query
    );
  }

  async queryCount(query: FieldTypeQuery): Promise<number> {
    return await RepositoryUtils.queryCount(
      KnexFieldTypeRepository._FIELD_TYPES,
      query
    );
  }
}
