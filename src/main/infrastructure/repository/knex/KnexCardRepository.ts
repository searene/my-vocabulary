import { CardRepository } from "../CardRepository";
import { CardDO } from "../../do/CardDO";
import * as KnexFactory from "./KnexFactory";
import { CardQuery } from "../../query/CardQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardInstanceQuery } from "../../query/CardInstanceQuery";
import { BookQuery } from "../../query/BookQuery";
import * as DateUtils from "../../../utils/DateUtils";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardRepository implements CardRepository {
  private static readonly _CARDS = "cards";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(dataObject: CardDO): Promise<void> {
    await RepositoryUtils.updateById(KnexCardRepository._CARDS, dataObject);
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("cards");
    if (!tablesExists) {
      await knex.schema.createTable("cards", (table) => {
        table.increments();
        table.integer("card_type_id");
        table.integer("book_id");
        table.string("word");
        table.dateTime("create_time");
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

  async batchQueryByIds(ids: number[]): Promise<CardDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexCardRepository._CARDS,
      ids
    );
  }

  async insert(cardDO: CardDO): Promise<CardDO> {
    return await RepositoryUtils.insert(KnexCardRepository._CARDS, cardDO);
  }

  async queryById(id: number): Promise<CardDO | undefined> {
    return await RepositoryUtils.queryById(KnexCardRepository._CARDS, id);
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexCardRepository._CARDS,
      id
    );
  }

  async queryOne(query: CardQuery): Promise<CardDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexCardRepository._CARDS,
      query);
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexCardRepository._CARDS,
      id
    );
  }

  async delete(query: CardQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexCardRepository._CARDS,
      query
    );
  }

  async queryCount(query: CardQuery): Promise<number> {
    return await RepositoryUtils.queryCount(
      KnexCardRepository._CARDS,
      query
    );
  }

  async getTodayAddedCardCount(bookId: number): Promise<number> {
    const queryInterface = knex
      .from(KnexCardRepository._CARDS)
      .count("*", {as: "cnt"})
      .where({bookId})
      .andWhere("create_time", ">=", DateUtils.getStartOfToday().getTime())
      .andWhere("create_time", "<=", DateUtils.getEndOfToday().getTime())
    const rows = await queryInterface;
    if (rows.length !== 1) {
      throw new Error("The size of rows must be 1, actual rows: " + rows);
    }
    return rows[0].cnt as number;
  }
}
