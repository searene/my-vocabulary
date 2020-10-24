import * as KnexFactory from "./KnexFactory";
import { CardTypeRepository } from "../CardTypeRepository";
import { CardTypeDO } from "../../do/CardTypeDO";
import { CardTypeQuery } from "../../query/CardTypeQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardTypeRepository implements CardTypeRepository {
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
    const insertIds = await knex("card_types").insert({
      name: cardTypeDO.name,
    });
    if (insertIds.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return (await this.query({ id: insertIds[0] }))[0];
  }

  async query(query: CardTypeQuery, options?: Options): Promise<CardTypeDO[]> {
    const queryInterface = knex.from("card_types").select(Object.keys(query));
    if (options !== undefined) {
      if (options.offset !== undefined) {
        queryInterface.offset(options.offset);
      }
      if (options.limit !== undefined) {
        queryInterface.limit(options.limit);
      }
    }
    queryInterface.where(query);
    // this.addQueryConditions(wordQuery, queryInterface);
    const rows = await queryInterface;
    return rows as CardTypeDO[];
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
