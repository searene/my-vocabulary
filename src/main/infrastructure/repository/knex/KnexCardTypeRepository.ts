import * as KnexFactory from "./KnexFactory";
import { CardTypeRepository } from "../CardTypeRepository";
import { CardTypeDO } from "../../do/CardTypeDO";
import { CardTypeQuery } from "../../query/CardTypeQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardTypeRepository implements CardTypeRepository {
  private static readonly _CARD_TYPES = "card_types";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: CardTypeDO): Promise<CardTypeDO> {
    throw new Error("Method not implemented.");
  }
  async batchInsert(dataObjects: CardTypeDO[]): Promise<CardTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(id: number[]): Promise<CardTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async insert(cardTypeDO: CardTypeDO): Promise<CardTypeDO> {
    return RepositoryUtils.insert(
      KnexCardTypeRepository._CARD_TYPES,
      cardTypeDO
    );
  }

  async query(query: CardTypeQuery, options?: Options): Promise<CardTypeDO[]> {
    return RepositoryUtils.query(
      KnexCardTypeRepository._CARD_TYPES,
      query,
      options
    );
  }

  async createTableIfNotExists(): Promise<void> {
    const tableExists = await knex.schema.hasTable("card_types");
    if (!tableExists) {
      await knex.schema.createTable("card_types", table => {
        table.increments();
        table.string("name");
      });
    }
  }
}
