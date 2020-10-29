import { CardRepository } from "../CardRepository";
import { CardDO } from "../../do/CardDO";
import * as KnexFactory from "./KnexFactory";
import { CardQuery } from "../../query/CardQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";
import { KnexCardTypeRepository } from "./KnexCardTypeRepository";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardRepository implements CardRepository {
  private static readonly _CARDS = "cards";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: CardDO): Promise<CardDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("cards");
    if (!tablesExists) {
      await knex.schema.createTable("cards", (table) => {
        table.increments();
        table.integer("card_type_id");
        table.integer("book_id");
      });
    }
  }
  async batchInsert(dataObjects: CardDO[]): Promise<CardDO[]> {
    throw new Error("Method not implemented.");
  }

  async query(query: CardQuery, options?: Options): Promise<CardDO[]> {
    return await RepositoryUtils.query(
      KnexCardRepository._CARDS,
      query,
      options
    );
  }

  async batchQueryByIds(id: number[]): Promise<CardDO[]> {
    throw new Error("Method not implemented.");
  }

  async insert(cardDO: CardDO): Promise<CardDO> {
    return await RepositoryUtils.insert(KnexCardRepository._CARDS, cardDO);
  }
}
