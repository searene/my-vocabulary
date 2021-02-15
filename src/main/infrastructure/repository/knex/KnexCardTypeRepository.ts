import * as KnexFactory from "./KnexFactory";
import { CardTypeRepository } from "../CardTypeRepository";
import { CardTypeDO } from "../../do/CardTypeDO";
import { CardTypeQuery } from "../../query/CardTypeQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { CardQuery } from "../../query/CardQuery";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardTypeRepository implements CardTypeRepository {
  private static readonly _CARD_TYPES = "card_types";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(dataObject: CardTypeDO): Promise<void> {
    await RepositoryUtils.updateById(
      KnexCardTypeRepository._CARD_TYPES,
      dataObject
    );
  }
  async batchInsert(dataObjects: CardTypeDO[]): Promise<CardTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(ids: number[]): Promise<CardTypeDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexCardTypeRepository._CARD_TYPES,
      ids
    );
  }
  async insert(cardTypeDO: CardTypeDO): Promise<CardTypeDO> {
    return await RepositoryUtils.insert(
      KnexCardTypeRepository._CARD_TYPES,
      cardTypeDO
    );
  }

  async query(query: CardTypeQuery, options?: Options): Promise<CardTypeDO[]> {
    return await RepositoryUtils.query(
      KnexCardTypeRepository._CARD_TYPES,
      query,
      options
    );
  }

  async createTableIfNotExists(): Promise<void> {
    const tableExists = await knex.schema.hasTable("card_types");
    if (!tableExists) {
      await knex.schema.createTable("card_types", (table) => {
        table.increments();
        table.string("name");
      });
    }
  }

  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(
      KnexCardTypeRepository._CARD_TYPES,
      id
    );
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexCardTypeRepository._CARD_TYPES,
      id
    );
  }

  async queryOne(query: CardTypeQuery): Promise<CardTypeDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexCardTypeRepository._CARD_TYPES,
      query);
  }
}
