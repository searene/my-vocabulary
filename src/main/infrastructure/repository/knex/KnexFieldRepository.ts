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
  async updateById(dataObject: FieldDO): Promise<void> {
    await RepositoryUtils.updateById(KnexFieldRepository._FIELDS, dataObject);
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable(
      KnexFieldRepository._FIELDS
    );
    if (!tablesExists) {
      await knex.schema.createTable(KnexFieldRepository._FIELDS, (table) => {
        table.increments();
        table.string("original_contents");
        table.string("plain_text_contents");
        table.integer("card_id");
        table.integer("field_type_id");
      });
    }
  }
  async upsert(fieldTypeDO: FieldDO): Promise<FieldDO> {
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
  async batchQueryByIds(ids: number[]): Promise<FieldDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexFieldRepository._FIELDS,
      ids
    );
  }

  async queryById(id: number): Promise<FieldDO | undefined> {
    return await RepositoryUtils.queryById(KnexFieldRepository._FIELDS, id);
  }

  async queryByIdOrThrow(id: number): Promise<FieldDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexFieldRepository._FIELDS,
      id
    );
  }

  async queryOne(query: FieldQuery): Promise<FieldDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexFieldRepository._FIELDS,
      query);
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexFieldRepository._FIELDS,
      id
    );
  }
  async delete(query: FieldQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexFieldRepository._FIELDS,
      query
    );
  }

  async batchQueryByCardIds(cardIds: number[]): Promise<FieldDO[]> {
    const queryBuilder = knex.from(KnexFieldRepository._FIELDS)
      .select("*")
      .whereIn("card_id", cardIds);
    return (await queryBuilder) as FieldDO[];
  }

  async queryCount(query: FieldQuery): Promise<number> {
    return await RepositoryUtils.queryCount(
      KnexFieldRepository._FIELDS,
      query
    );
  }
}
