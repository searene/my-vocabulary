import { injectable } from "@parisholley/inversify-async";
import { combineReducers } from "redux";
import { CompositionDO } from "../../do/CompositionDO";
import { CompositionQuery } from "../../query/CompositionQuery";
import { Options } from "../../query/Options";
import { CompositionRepository } from "../CompositionRepository";
import { RepositoryUtils } from "../RepositoryUtils";
import { knex } from "./KnexFactory";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { CardTypeQuery } from "../../query/CardTypeQuery";
import { CardTypeDO } from "../../do/CardTypeDO";
import { CardQuery } from "../../query/CardQuery";

@injectable()
export class KnexCompositionRepository implements CompositionRepository {
  private static readonly _COMPOSITIONS = "compositions";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async insert(CompositionDO: CompositionDO): Promise<CompositionDO> {
    return await RepositoryUtils.insert(
      KnexCompositionRepository._COMPOSITIONS,
      CompositionDO
    );
  }
  async batchInsert(dataObjects: CompositionDO[]): Promise<CompositionDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(
    query: CompositionQuery,
    options?: Options
  ): Promise<CompositionDO[]> {
    return await RepositoryUtils.query(
      KnexCompositionRepository._COMPOSITIONS,
      query,
      options
    );
  }
  async batchQueryByIds(ids: number[]): Promise<CompositionDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexCompositionRepository._COMPOSITIONS,
      ids
    );
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("compositions");
    if (!tablesExists) {
      await knex.schema.createTable("compositions", (table) => {
        table.increments();
        table.string("name");
        table.integer("card_type_id");
        table.string("front_type_ids");
        table.string("back_type_ids");
      });
    }
  }
  async updateById(dataObject: CompositionDO): Promise<void> {
    await RepositoryUtils.updateById(
      KnexCompositionRepository._COMPOSITIONS,
      dataObject
    );
  }

  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(
      KnexCompositionRepository._COMPOSITIONS,
      id
    );
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexCompositionRepository._COMPOSITIONS,
      id
    );
  }

  async queryOne(query: CompositionQuery): Promise<CompositionDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexCompositionRepository._COMPOSITIONS,
      query);
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexCompositionRepository._COMPOSITIONS,
      id
    );
  }
  async delete(query: CompositionQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexCompositionRepository._COMPOSITIONS,
      query
    );
  }

}
