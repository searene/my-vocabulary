import { CardRepository } from "../CardRepository";
import { CardDO } from "../../do/CardDO";
import * as KnexFactory from "./KnexFactory";
import { CardQuery } from "../../query/CardQuery";
import { injectable } from "inversify";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardRepository implements CardRepository {
  updateById(id: number, dataObject: CardDO): Promise<CardDO> {
    throw new Error("Method not implemented.");
  }
  createTableIfNotExists(): Promise<void> {
    throw new Error("Method not implemented.");
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
    const insertResult = await knex("card")
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
