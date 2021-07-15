import { injectable } from "@parisholley/inversify-async";
import { WordDO } from "../../do/word/WordDO";
import { Options } from "../../query/Options";
import { WordQuery } from "../../query/WordQuery";
import { RepositoryUtils } from "../RepositoryUtils";
import { WordRepository } from "../WordRepository";
import { knex } from "./KnexFactory";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { ALL_ZEROS_WORD_COUNT, WordCount } from "../../../domain/WordCount";
import { WordStatus } from "../../../enum/WordStatus";
import { isNullOrUndefined, removeUndefinedKeys } from "../../../utils/ObjectUtils";

@injectable()
export class KnexWordRepository implements WordRepository {
  private static readonly _WORDS = "words";

  async updateByOriginalWord(wordDO: WordDO): Promise<void> {
    await knex(KnexWordRepository._WORDS)
      .where("original_word", wordDO.originalWord)
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
  async query(query: WordQuery, options?: Options): Promise<WordDO[]> {
    return await RepositoryUtils.query(KnexWordRepository._WORDS, query, options);
  }
  async queryWordWithPositionsArray(query: WordQuery, options?: Options): Promise<WordWithPositions[]> {
    query = removeUndefinedKeys(query);
    const rows: any[] = await RepositoryUtils.getQueryInterface(KnexWordRepository._WORDS, query, options);
    if (isNullOrUndefined(rows) || rows.length === 0) {
      return [];
    }
    return rows.map(row => this.toWordWithPositionsObject(row.originalWord, row.wordWithPositions));
  }
  async queryOriginalWordWithPositionsArray(bookId: number, status: WordStatus, originalWord?: string, options?: Options): Promise<WordWithPositions[]> {
    const query = knex("words")
        .select("original_word",
                knex.raw(`GROUP_CONCAT(word || ":" || positions || ";", "") as word_with_positions`))
        .groupBy("original_word");
    if (originalWord === undefined) {
      query.where({ bookId, status });
    } else {
      query.where({ bookId, status, originalWord });
    }
    if (options !== undefined && options.offset !== undefined) {
      query.offset(options.offset);
    }
    if (options !== undefined && options.limit !== undefined) {
      query.limit(options.limit);
    }
    const rows: any[] = await query;
    if (isNullOrUndefined(rows) || rows.length === 0) {
      return [];
    }
    return rows.map(row => this.toWordWithPositionsObject(row.originalWord, row.wordWithPositions));
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
    const queryInterface = RepositoryUtils.getQueryInterface(KnexWordRepository._WORDS, query, { offset: 0, limit: 1 });
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

  async getOriginalWordCount(bookId: number): Promise<WordCount> {
    const rows = await this.getWordCountQueryInterface(bookId);
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

  /**
   * @param wordWithPositions example: clock:30;clocks:36;
   */
  private toWordWithPositionsObject(originalWord: string, wordWithPositions: string): WordWithPositions {
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
    return { originalWord, positions };
  }

  private getWordCountQueryInterface(bookId: number) {
    return knex(knex(KnexWordRepository._WORDS)
                .select("original_word", "status")
                .where({ bookId })
                .groupBy("original_word"))
          .select("status")
          .count("*", {as: "cnt"})
          .groupBy("status")
  }

}

