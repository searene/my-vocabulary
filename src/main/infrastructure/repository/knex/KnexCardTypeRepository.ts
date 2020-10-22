import * as KnexFactory from "./KnexFactory";
import { CardTypeRepository } from "../CardTypeRepository";
import { CardTypeDO } from "../../do/CardTypeDO";
import { CardTypeQuery } from "../../query/CardTypeQuery";
import { injectable } from "inversify";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardTypeRepository implements CardTypeRepository {
  updateById(id: number, dataObject: CardTypeDO): Promise<CardTypeDO> {
    throw new Error("Method not implemented.");
  }
  async batchInsert(dataObjects: CardTypeDO[]): Promise<CardTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(id: number[]): Promise<CardTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async insert(cardTypeDO: CardTypeDO): Promise<CardTypeDO> {
    const insertResult = await knex("card_type")
      .insert({
        name: cardTypeDO.name,
      })
      .returning("id");
    if (insertResult.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return insertResult[0];
  }

  async query(query: CardTypeQuery): Promise<CardTypeDO[]> {
    const selectResult = await knex.select("id", "name").from("card_type");
    return selectResult.map(data => ({
      id: data["id"],
      name: data["name"],
    }));
  }

  async createTableIfNotExists(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
