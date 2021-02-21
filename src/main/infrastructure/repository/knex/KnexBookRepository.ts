import { BookRepository } from "../BookRepository";
import { BookDO } from "../../do/BookDO";
import { BookQuery } from "../../query/BookQuery";
import { Options } from "../../query/Options";
import { knex } from "./KnexFactory";
import { RepositoryUtils } from "../RepositoryUtils";
import { injectable } from "@parisholley/inversify-async";

@injectable()
export class KnexBookRepository implements BookRepository {
  private static readonly _BOOKS = "books";

  async batchInsert(dataObjects: BookDO[]): Promise<BookDO[]> {
    return RepositoryUtils.batchInsert(
      KnexBookRepository._BOOKS,
      dataObjects
    );
  }

  async batchQueryByIds(ids: number[]): Promise<BookDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexBookRepository._BOOKS,
      ids
    );
  }

  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable(KnexBookRepository._BOOKS);
    if (!tablesExists) {
      await knex.schema.createTable(KnexBookRepository._BOOKS, (table) => {
        table.increments();
        table.integer("name");
        table.integer("contents");
      });
    }
  }

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }

  async insert(dataObject: BookDO): Promise<BookDO> {
    return await RepositoryUtils.insert(
      KnexBookRepository._BOOKS,
      dataObject
    );
  }

  async query(query: BookQuery, options?: Options): Promise<BookDO[]> {
    return await RepositoryUtils.query(
      KnexBookRepository._BOOKS,
      query,
      options
    );
  }

  async queryById(id: number): Promise<BookDO | undefined> {
    return await RepositoryUtils.queryById(
      KnexBookRepository._BOOKS,
      id
    );
  }

  async queryByIdOrThrow(id: number): Promise<BookDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexBookRepository._BOOKS,
      id
    );
  }

  async queryOne(query: BookQuery): Promise<BookDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexBookRepository._BOOKS,
      query);
  }

  async updateById(dataObject: BookDO): Promise<void> {
    await RepositoryUtils.updateById(
      KnexBookRepository._BOOKS,
      dataObject
    );
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexBookRepository._BOOKS,
      id
    );
  }

  async delete(query: BookQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexBookRepository._BOOKS,
      query
    );
  }

  async queryCount(query: BookQuery): Promise<number> {
    return await RepositoryUtils.queryCount(
      KnexBookRepository._BOOKS,
      query
    );
  }
}