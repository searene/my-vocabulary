import { CardRepository } from "../CardRepository";
import { CardDO } from "../../do/CardDO";
import * as KnexFactory from "./KnexFactory";
import { CardQuery } from "../../query/CardQuery";
import { injectable } from "@parisholley/inversify-async";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardRepository implements CardRepository {
  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: CardDO): Promise<CardDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("cards");
    if (!tablesExists) {
      await knex.schema.createTable("cards", table => {
        table.increments();
        table.integer("card_type_id");
        table.integer("book_id");
      });
    }
  }
  async batchInsert(dataObjects: CardDO[]): Promise<CardDO[]> {
    throw new Error("Method not implemented.");
  }

  async query(query: CardQuery): Promise<CardDO[]> {
    throw new Error("Method not implemented.");
  }

  async batchQueryByIds(id: number[]): Promise<CardDO[]> {
    throw new Error("Method not implemented.");
  }

  async insert(cardDO: CardDO): Promise<CardDO> {
    const insertResult = await knex("cards")
      .insert({
        cardTypeId: cardDO.cardTypeId,
        bookId: cardDO.bookId,
      })
      .returning("id");
    if (insertResult.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return insertResult[0];
  }
}
