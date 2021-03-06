import { injectable } from "@parisholley/inversify-async";
import { WordDO } from "../../do/WordDO";
import { Options } from "../../query/Options";
import { WordQuery } from "../../query/WordQuery";
import { RepositoryUtils } from "../RepositoryUtils";
import { WordRepository } from "../WordRepository";
import { knex } from "./KnexFactory";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { ALL_ZEROS_WORD_COUNT, WordCount } from "../../../domain/WordCount";
import { WordStatus } from "../../../enum/WordStatus";

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
  async updateById(dataObject: WordDO): Promise<void> {
    await RepositoryUtils.updateById(KnexWordRepository._WORDS, dataObject);
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
  async batchQueryByIds(ids: number[]): Promise<WordDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexWordRepository._WORDS,
      ids
    );
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

  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(KnexWordRepository._WORDS, id);
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexWordRepository._WORDS,
      id
    );
  }

  async queryOne(query: WordQuery): Promise<WordDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexWordRepository._WORDS,
      query);
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexWordRepository._WORDS,
      id
    );
  }
  async delete(query: WordQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexWordRepository._WORDS,
      query
    );
  }

  async queryCount(query: WordQuery): Promise<number> {
    return await RepositoryUtils.queryCount(
      KnexWordRepository._WORDS,
      query
    );
  }

  async getWordCount(bookId: number): Promise<WordCount> {
    const rows = await knex(KnexWordRepository._WORDS)
      .select("status")
      .count("* AS cnt")
      .where({bookId})
      .groupBy("status");
    const wordCount = {
      ...ALL_ZEROS_WORD_COUNT
    };
    for (const row of rows) {
      if (row.status === WordStatus.UNKNOWN) {
        wordCount.unknown = row.cnt as number;
      } else if (row.status === WordStatus.KNOWN) {
        wordCount.known = row.cnt as number;
      } else if (row.status === WordStatus.SKIPPED) {
        wordCount.skipped = row.cnt as number;
      }
    }
    return wordCount;
  }
}
