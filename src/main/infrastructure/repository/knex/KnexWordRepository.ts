import { injectable } from "inversify";
import { QueryInterface } from "knex";
import { WordDO } from "../../do/WordDO";
import { WordQuery } from "../../query/WordQuery";
import { WordRepository } from "../WordRepository";
import { knex } from "./KnexFactory";

@injectable()
export class KnexWordRepository implements WordRepository {
  async insert(wordDO: WordDO): Promise<WordDO> {
    wordDO.id = await knex("words").insert(wordDO);
    return wordDO;
  }
  async batchInsert(wordDOs: WordDO[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(wordQuery: WordQuery): Promise<WordDO[]> {
    const queryInterface = knex.from("words").select("*");
    if (wordQuery.offset !== undefined) {
      queryInterface.offset(wordQuery.offset);
      delete wordQuery.offset;
    }
    if (wordQuery.limit !== undefined) {
      queryInterface.limit(wordQuery.limit);
      delete wordQuery.limit;
    }
    queryInterface.where(wordQuery);
    // this.addQueryConditions(wordQuery, queryInterface);
    const rows = await queryInterface;
    return rows as WordDO[];
  }
  async batchQueryByIds(id: number[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }

  // private addQueryConditions(wordQuery: WordQuery, queryInterface: QueryInterface) {
  //     if (wordQuery.id !== undefined) {
  //         queryInterface.where("id", "=", wordQuery.id);
  //     }
  //     if (wordQuery.bookId !== undefined) {
  //         queryInterface.where("book_id", "=", wordQuery.bookId);
  //     }
  //     if (wordQuery.originalWord !== undefined) {
  //         queryInterface.where("original_word", "=", wordQuery.originalWord);
  //     }
  //     if(wordQuery.positions !== undefined) {
  //         queryInterface.where("positions", "=", wordQuery.positions);
  //     }
  //     if (wordQuery.status !== undefined) {
  //         queryInterface.where("status", "=", wordQuery.status);
  //     }
  //     if (wordQuery.word !== undefined) {
  //         queryInterface.where("word", "=", wordQuery.word);
  //     }
  // }
}
