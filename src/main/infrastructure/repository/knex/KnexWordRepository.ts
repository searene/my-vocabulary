import { injectable } from "@parisholley/inversify-async";
import { WordDO } from "../../do/word/WordDO";
import { Options } from "../../query/Options";
import { WordQuery } from "../../query/word/WordQuery";
import { RepositoryUtils } from "../RepositoryUtils";
import { WordRepository } from "../WordRepository";
import { knex } from "./KnexFactory";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { ALL_ZEROS_WORD_COUNT, WordCount } from "../../../domain/WordCount";
import { WordStatus } from "../../../enum/WordStatus";
import { QueryBuilder } from "knex";
import { isNullOrUndefined, removeUndefinedKeys } from "../../../utils/ObjectUtils";
import { BaseWordQuery } from "../../query/word/BaseWordQuery";

@injectable()
export class KnexWordRepository implements WordRepository {
  private static readonly _WORDS = "words";

  async updateByWord(wordDO: WordDO): Promise<void> {
    await knex(KnexWordRepository._WORDS)
      .where("word", wordDO.word)
      .update(wordDO);
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
  async upsert(wordDO: WordDO): Promise<WordDO> {
    return await RepositoryUtils.insert(KnexWordRepository._WORDS, wordDO);
  }
  async batchInsert(wordDOs: WordDO[]): Promise<WordDO[]> {
    throw new Error("Method not implemented.");
  }
  async baseQuery(query: BaseWordQuery, options?: Options): Promise<WordDO[]> {
    return await RepositoryUtils.query(KnexWordRepository._WORDS, query, options);
  }
  async query(query: WordQuery, options?: Options): Promise<WordDO[]> {
    throw new Error("KnexWordRepository.query is not implemented");
  }
  async queryWordWithPositionsArray(query: WordQuery, options?: Options): Promise<WordWithPositions[]> {
    query = removeUndefinedKeys(query);
    const rows: any[] = await this.getQueryInterface(query, options);
    if (isNullOrUndefined(rows) || rows.length === 0) {
      return [];
    }
    return rows.map(row => this.toWordWithPositionsObject(row.word, row.originalWord, row.wordWithPositions));
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
    const queryInterface = this.getQueryInterface(query, { offset: 0, limit: 1 });
    const rows = await queryInterface;
    if (rows === undefined || rows === null || rows.length === 0) {
      return undefined;
    } else {
      return rows[0];
    }
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
    throw new Error("KnexWordRepository.queryCount is not implemented.");
  }

  async getWordCount(bookId: number): Promise<WordCount> {
    const rows = await this.getWordCountQueryInterface(bookId, false);
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

  async getOriginalWordCount(bookId: number): Promise<WordCount> {
    const rows = await this.getWordCountQueryInterface(bookId, true);
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

  async updateStatusByBookIdAndOriginalWord(bookId: number, originalWord: string, status: WordStatus): Promise<void> {
    await knex(KnexWordRepository._WORDS)
      .where({ originalWord, bookId, status })
      .update({ status });
  }

  private async getQueryInterface(query: WordQuery, options?: Options) {
    let queryInterface;
    if (!query.onlyCountOriginalWords || query.status === WordStatus.SKIPPED) {
      queryInterface = this.getQueryInterfaceWithoutLimit(query)
        .select("*", knex.raw(`word || ":" || positions || ";" as word_with_positions`))
    } else {
      queryInterface = this.getQueryInterfaceWithoutLimit(query);
    }
    if (options?.offset !== undefined) {
      queryInterface.offset(options?.offset);
    }
    if (options?.limit !== undefined) {
      queryInterface.limit(options?.limit);
    }
    return queryInterface;
  }

  private getQueryInterfaceWithoutLimit(query: WordQuery): QueryBuilder {
    if (!query.onlyCountOriginalWords || query.status === WordStatus.SKIPPED) {
      delete query.onlyCountOriginalWords;
      return RepositoryUtils.getQueryInterfaceWithoutLimit(
        KnexWordRepository._WORDS,
        query,
      );
    }
    delete query.onlyCountOriginalWords;
    let queryInterface;
    if (query.status === WordStatus.UNKNOWN) {
      queryInterface = knex(
        knex("words")
        .select("original_word as word",
                "original_word",
                knex.raw(`GROUP_CONCAT(word || ":" || positions || ";", "") as word_with_positions`))
        .where(query)
        .as("a")
        .groupBy("original_word")
      )
      .leftJoin(
        knex("words")
        .distinct("original_word")
        .whereIn('status', [WordStatus.KNOWN, WordStatus.SKIPPED])
        .as("b"),
        "a.original_word", "b.original_word"
      )
      .whereNull("b.original_word")
      .select("a.*")
    } else if (query.status === WordStatus.KNOWN) {
      queryInterface = knex(
        knex("words")
        .select("original_word as word",
                "original_word",
                knex.raw(`GROUP_CONCAT(word || ":" || positions || ";", "") as word_with_positions`))
        .where(query)
        .as("a")
        .groupBy("original_word")
      )
      .join(
        knex("words")
        .distinct("original_word")
        .where({ status: query.status })
        .as("b"),
        "a.original_word", "b.original_word"
      )
      .select("a.*")
    } else {
      throw new Error("Unsupported word status: " + status);
    }
    return queryInterface;
  }
  /**
   * @param wordWithPositions example: clock:30;clocks:36;
   */
  private toWordWithPositionsObject(word: string, originalWord: string, wordWithPositions: string): WordWithPositions {
    const wordWithPositionsArray = wordWithPositions.split(";");
    const positions: WordPosition[] = [];
    for (const wordWithPositionsElement of wordWithPositionsArray) {
      if (wordWithPositionsElement.length === 0) {
        continue;
      }
      const wordWithPositionsElementSplit = wordWithPositionsElement.split(":");
      const startWordPosArray = wordWithPositionsElementSplit[1].split(",");
      for (const startWordPos of startWordPosArray) {
        positions.push({
          startWordPos: parseInt(startWordPos),
          endWordPos: wordWithPositionsElementSplit[0].length + parseInt(startWordPos)
        });
      }
    }
    return { word, originalWord, positions };
  }

  private getWordCountQueryInterface(bookId: number, onlyCountOriginalWords: boolean) {
    if (!onlyCountOriginalWords) {
      return knex(KnexWordRepository._WORDS)
            .select("status")
            .countDistinct("word", {as: "cnt"})
            .where({ bookId })
            .groupBy("status");
    }
    return knex(knex(KnexWordRepository._WORDS)
                .select("original_word as word",

                        // If all the words are unknown, then the original word is unknown.
                        // If there is at least one known word, then the original word is known.
                        // If there is at least on skipped word, then the original word is skipped.
                        knex.raw(`case when max(status) = 0 then 0
                                      when max(status) = 1 then 1
                                      when max(status) = 2 then 2
                                  end as status`))
                .where({ bookId })
                .groupBy("original_word"))
          .select("status")
          .count("word", {as: "cnt"})
          .groupBy("status")
  }

}

