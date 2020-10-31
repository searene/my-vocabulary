import { injectable } from "@parisholley/inversify-async";
import { WatchDog } from "../../../WatchDog";
import { WordDO } from "../../do/WordDO";
import { Options } from "../../query/Options";
import { WordQuery } from "../../query/WordQuery";
import { RepositoryUtils } from "../RepositoryUtils";
import { WordRepository } from "../WordRepository";
import { knex } from "./KnexFactory";

@injectable()
export class KnexWordRepository implements WordRepository {
  private static readonly _WORDS = "words";

  async updateByWord(wordDO: WordDO): Promise<WordDO[]> {
    await knex(KnexWordRepository._WORDS)
      .where("word", wordDO.word)
      .update(wordDO);
    return await this.query({ word: wordDO.word });
  }
  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }
  async updateById(id: number, dataObject: WordDO): Promise<WordDO> {
    throw new Error("Method not implemented.");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable(KnexWordRepository._WORDS);
    if (!tablesExists) {
      await knex.schema.createTable(KnexWordRepository._WORDS, (table) => {
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
    return await RepositoryUtils.insert(KnexWordRepository._WORDS, wordDO);
  }
  async batchInsert(wordDOs: WordDO[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(query: WordQuery, options?: Options): Promise<WordDO[]> {
    return await RepositoryUtils.query(
      KnexWordRepository._WORDS,
      query,
      options
    );
  }
  async batchQueryByIds(id: number[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }

  async updateWordStatus(): Promise<void> {
    const knownWords: WordDO[] = await knex
      .from(KnexWordRepository._WORDS)
      .select("word")
      .distinct()
      .where("status", 1);
    for (const knownWord of knownWords) {
      console.log("updating: " + knownWord.word);
      await knex(KnexWordRepository._WORDS)
        .where("word", knownWord.word)
        .update({
          status: 1,
        });
    }
  }
}
