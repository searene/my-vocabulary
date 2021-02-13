import { ReviewDO } from "../../do/ReviewDO";
import * as KnexFactory from "./KnexFactory";
import { ReviewQuery } from "../../query/ReviewQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";
import { ReviewRepository } from "../ReviewRepository";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";

const knex = KnexFactory.knex;

@injectable()
export class KnexReviewRepository implements ReviewRepository {
  private static readonly _REVIEWS = "reviews";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: ReviewDO): Promise<ReviewDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable(
      KnexReviewRepository._REVIEWS
    );
    if (!tablesExists) {
      await knex.schema.createTable(KnexReviewRepository._REVIEWS, (table) => {
        table.increments();
        table.integer("card_instance_id");
        table.dateTime("review_time");
        table.string("level");
      });
    }
  }
  async batchInsert(reviewDOs: ReviewDO[]): Promise<ReviewDO[]> {
    throw new Error("Method not implemented.");
  }

  async query(query: ReviewQuery, options?: Options): Promise<ReviewDO[]> {
    return await RepositoryUtils.query(
      KnexReviewRepository._REVIEWS,
      query,
      options
    );
  }

  async batchQueryByIds(ids: number[]): Promise<ReviewDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexReviewRepository._REVIEWS,
      ids
    );
  }

  async insert(reviewDO: ReviewDO): Promise<ReviewDO> {
    return await RepositoryUtils.insert(
      KnexReviewRepository._REVIEWS,
      reviewDO
    );
  }

  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(KnexReviewRepository._REVIEWS, id);
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexReviewRepository._REVIEWS,
      id
    );
  }
}
