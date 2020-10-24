import { CardRepository } from "../CardRepository";
import { CardDO } from "../../do/CardDO";
import * as KnexFactory from "./KnexFactory";
import { CardQuery } from "../../query/CardQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";

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

  async query(query: CardQuery, options?: Options): Promise<CardDO[]> {
    const queryInterface = knex.from("cards").select(Object.keys(query));
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
    return rows as CardDO[];
  }

  async batchQueryByIds(id: number[]): Promise<CardDO[]> {
    throw new Error("Method not implemented.");
  }

  async insert(cardDO: CardDO): Promise<CardDO> {
    const insertedIds = await knex("cards").insert(cardDO);
    if (insertedIds.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return (await this.query({ id: insertedIds[0] }))[0];
  }
}
