import { CardInstanceRepository } from "../CardInstanceRepository";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import * as KnexFactory from "./KnexFactory";
import { CardInstanceQuery } from "../../query/CardInstanceQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";

const knex = KnexFactory.knex;

@injectable()
export class KnexCardInstanceRepository implements CardInstanceRepository {
  private static readonly _CARD_INSTANCES = "card_instances";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(
    id: number,
    dataObject: CardInstanceDO
  ): Promise<CardInstanceDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("card_instances");
    if (!tablesExists) {
      await knex.schema.createTable("card_instances", (table) => {
        table.increments();
        table.integer("card_id");
        table.integer("composition_id");
        table.dateTime("due_time");
        table.integer("book_id");
      });
    }
  }
  async batchInsert(dataObjects: CardInstanceDO[]): Promise<CardInstanceDO[]> {
    throw new Error("Method not implemented.");
  }

  async query(
    query: CardInstanceQuery,
    options?: Options
  ): Promise<CardInstanceDO[]> {
    return await RepositoryUtils.query(
      KnexCardInstanceRepository._CARD_INSTANCES,
      query,
      options
    );
  }

  async batchQueryByIds(id: number[]): Promise<CardInstanceDO[]> {
    throw new Error("Method not implemented.");
  }

  async insert(cardInstanceDO: CardInstanceDO): Promise<CardInstanceDO> {
    return await RepositoryUtils.insert(
      KnexCardInstanceRepository._CARD_INSTANCES,
      cardInstanceDO
    );
  }

  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(
      KnexCardInstanceRepository._CARD_INSTANCES,
      id
    );
  }

  async queryNextDueCardInstance(
    bookId: number
  ): Promise<CardInstanceDO | undefined> {
    const rows = (await knex
      .from(KnexCardInstanceRepository._CARD_INSTANCES)
      .select("*")
      .where({ bookId })
      .andWhere("due_time", ">", Date.now())
      .limit(1)) as CardInstanceDO[];
    if (rows.length == 0) {
      return undefined;
    }
    return rows[0];
  }
}
