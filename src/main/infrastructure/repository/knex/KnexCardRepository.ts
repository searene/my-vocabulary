import { CardRepository } from "../CardRepository";
import { CardDO } from "../../do/CardDO";
import * as KnexFactory from "./KnexFactory";
import { CardQuery } from "../../query/CardQuery";

const knex = KnexFactory.knex;

export class KnexCardRepository implements CardRepository {
  async insert(cardDO: CardDO): Promise<number> {
    const insertResult = await knex("card")
      .insert({
        cardTypeId: cardDO.cardTypeId,
      })
      .returning("id");
    if (insertResult.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return insertResult[0];
  }
}
