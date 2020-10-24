import { injectable } from "@parisholley/inversify-async";
import { WatchDog } from "../../../WatchDog";
import { WordDO } from "../../do/WordDO";
import { Options } from "../../query/Options";
import { WordQuery } from "../../query/WordQuery";
import { WordRepository } from "../WordRepository";
import { knex } from "./KnexFactory";

@injectable()
export class KnexWordRepository implements WordRepository {
  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: WordDO): Promise<WordDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("words");
    if (!tablesExists) {
      await knex.schema.createTable("words", table => {
        table.increments();
        table.integer("book_id");
        table.string("word");
        table.string("original_word");
        table.string("positions");
        table.integer("status");
      });
    }
  }
  async insert(wordDO: WordDO): Promise<WordDO> {
    wordDO.id = await knex("words").insert(wordDO);
    return wordDO;
  }
  async batchInsert(wordDOs: WordDO[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(wordQuery: WordQuery, options?: Options): Promise<WordDO[]> {
    const queryInterface = knex.from("words").select(Object.keys(wordQuery));
    if (options !== undefined) {
      if (options.offset !== undefined) {
        queryInterface.offset(options.offset);
      }
      if (options.limit !== undefined) {
        queryInterface.limit(options.limit);
      }
    }
    queryInterface.where(wordQuery);
    // this.addQueryConditions(wordQuery, queryInterface);
    const rows = await queryInterface;
    return rows as WordDO[];
  }
  async batchQueryByIds(id: number[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }

  async updateWordStatus(): Promise<void> {
    const knownWords: WordDO[] = await knex
      .from("words")
      .select("word")
      .distinct()
      .where("status", 1);
    for (const knownWord of knownWords) {
      console.log("updating: " + knownWord.word);
      await knex("words")
        .where("word", knownWord.word)
        .update({
          status: 1,
        });
    }
  }
}
