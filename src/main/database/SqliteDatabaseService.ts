import "reflect-metadata";
import { DatabaseService } from "./DatabaseService";
import * as sqliteImport from "sqlite3";
import { Database, RunResult } from "sqlite3";
import * as os from "os";
import {join} from "path";
import { existsSync, mkdirSync } from "fs";
import { container, injectable } from "tsyringe";
import { WordStatus } from "../enum/WordStatus";
import { WordQuery } from "../domain/WordQuery";
import { WordDO } from "../domain/WordDO";
import { BaseQuery } from "../domain/BaseQuery";
import { Optional } from "typescript-optional";
import { BookQuery } from "../domain/BookQuery";
import { BookDO } from "../domain/BookDO";
import { WordFormReader } from "../WordFormReader";
import { WordStatusInDatabase } from "../enum/WordStatusInDatabase";

const sqlite3 = sqliteImport.verbose();

export class SqliteDatabaseService implements DatabaseService {

  private db: Database;
  private initiated = false;

  private wordFormReader = container.resolve(WordFormReader);

  constructor() {
    const dir = join(os.homedir(), ".my-vocabulary");
    if (!existsSync(dir)) {
      mkdirSync(dir)
    }
    this.db = new sqlite3.Database(join(dir, "vocabulary.db"));
  }

  async init(): Promise<void> {
    if (this.initiated) {
      return;
    }
    await this.createTablesIfNotExists();
    this.initiated = true;
  }

  async writeBookContents(bookName: string, bookContents: string): Promise<number> {
    await this.init();
    const runResult = await this.run(`
      INSERT INTO books (name, contents, status) VALUES ($bookName, $bookContents, 0)
    `, {
      $bookName: bookName,
      $bookContents: bookContents
    });
    return runResult.lastID;
  }

  async writeWords(bookId: number, wordAndPosList: Map<string, number[]>): Promise<void> {
    await this.init();
    const sqlList = await this.getInsertWordsSqlList(bookId, wordAndPosList);
    for (const sql of sqlList) {
      await this.run(sql);
    }
  }

  async queryWords(wordQuery: WordQuery): Promise<WordDO[]> {
    await this.init();
    let sql = `SELECT id, book_id, word, positions, status FROM words WHERE 1 = 1`;

    // build where
    let where = "";
    let params: any = {};
    if (wordQuery.bookId != undefined) {
      where += "AND bookId = $bookId";
      params["$bookId"] = wordQuery.bookId;
    }
    if (wordQuery.status != undefined && wordQuery.status != WordStatus.knownOrKnowOriginal) {
      where += "AND status = $status";
      params["$status"] = wordQuery.status;
    } else if (wordQuery.status != undefined && wordQuery.word != undefined) {
      where += "AND (word = $word OR original_word = $word) AND status = $status";
      params["$word"] = wordQuery.word;
      params["$status"] = WordStatusInDatabase.Known;
    }
    if (wordQuery.word != undefined) {
      where += "AND word = $word";
      params["$word"] = wordQuery.word;
    }
    if (where != "") {
      sql += `${where}`;
    }

    const limitExpression = SqliteDatabaseService.getLimitExpression(wordQuery);
    if (limitExpression.isPresent()) {
      sql += limitExpression.get();
    }

    const rows = await this.all(sql, params);
    const wordDOList: WordDO[] = [];
    for (const row of rows) {
      wordDOList.push({
        id: row.id,
        bookId: row.book_id,
        word: row.word,
        originalWord: row.original_word,
        positions: (row.positions as string).split(",")
          .map(pos => parseInt(pos)),
        status: row.status
      });
    }
    return wordDOList;
  }

  async queryBooks(bookQuery: BookQuery): Promise<BookDO[]> {
    await this.init();
    let sql = `SELECT id, name, contents, status FROM books WHERE 1 = 1`;

    // build where
    let where = "";
    let params: any = {};
    if (bookQuery.id != undefined) {
      where += "AND id = $id";
      params["$id"] = bookQuery.id;
    }
    if (bookQuery.status != undefined) {
      where += "AND status = $status";
      params["$status"] = bookQuery.status;
    }
    if (bookQuery.name != undefined) {
      where += "AND name LIKE %$name%";
      params["$name"] = bookQuery.name;
    }
    if (where != "") {
      sql += `${where}`;
    }

    const limitExpression = SqliteDatabaseService.getLimitExpression(bookQuery);
    if (limitExpression.isPresent()) {
      sql += limitExpression.get();
    }

    const rows = await this.all(sql, params);
    const bookDOList: BookDO[] = [];
    for (const row of rows) {
      bookDOList.push({
        id: row.id,
        name: row.name,
        status: row.status,
        contents: row.contents
      });
    }
    return bookDOList;

  }

  private async getInsertWordsSqlList(bookId: number, wordAndPosListMap: Map<string, number[]>): Promise<string[]> {
    const sqlList = [];
    const sqlSuffix: string[] = [];
    for (const [word, posList] of wordAndPosListMap) {
      const originalWord = await this.wordFormReader.getOriginalWord(word);
      sqlSuffix.push(`(${bookId}, "${word}", "${originalWord.isPresent() ? originalWord.get() : ""}",
        "${posList.join(",")}", ${WordStatusInDatabase.Unknown})`);
    }

    const rowCountPerInsert = 2;
    const sqlPrefix = ` INSERT INTO words
      (book_id, word, original_word, positions, status) VALUES`;
    for (let i = 0; i < sqlSuffix.length; i+= rowCountPerInsert) {
      let sql = sqlPrefix;
      for (let j = i; j < Math.min(sqlSuffix.length, i + rowCountPerInsert); j += 1) {
        sql += sqlSuffix[j] + ",";
      }
      sql = sql.substring(0, sql.length - 1) + ";";
      sqlList.push(sql);
    }
    return sqlList;
  }

  private async createTablesIfNotExists(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INT PRIMARY KEY,
        name TEXT,
        contents TEXT,
        status INT -- 0: normal, -1: deleted
      );
    `);
    await this.run(`
      CREATE TABLE IF NOT EXISTS words (
        id INT PRIMARY KEY,
        book_id INT,
        word TEXT,
        original_word TEXT,
        positions TEXT,
        status INT -- -1: deleted, 0: unknown, 1: knowOriginal, 2: known
      );
    `);
  }

  private async run(sql: string, params?: any): Promise<RunResult> {
    return new Promise<RunResult>((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err != null) {
          reject(err);
        } else {
          resolve(this);
        }
      })
    });
  }

  private async all(sql: string, params?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  private static getLimitExpression(baseQuery: BaseQuery): Optional<string> {
    if (baseQuery.pageNo != undefined && baseQuery.pageSize != undefined) {
      return Optional.of(`LIMIT ${baseQuery.pageSize * baseQuery.pageNo} ${baseQuery.pageSize}`);
    }
    return Optional.empty();
  }
}