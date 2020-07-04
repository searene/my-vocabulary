import { DatabaseService } from "./DatabaseService";
import * as sqliteImport from 'sqlite3';
import * as os from 'os';
import {join} from 'path';
import { Database, RunResult } from "sqlite3";
import {existsSync, mkdirSync} from 'fs';
import { singleton } from "tsyringe";

const sqlite3 = sqliteImport.verbose();

export class SqliteDatabaseService implements DatabaseService {

  private db: Database;

  constructor() {
    const dir = join(os.homedir(), ".my-vocabulary");
    if (!existsSync(dir)) {
      mkdirSync(dir)
    }
    this.db = new sqlite3.Database(join(dir, "vocabulary.db"));
  }

  async init(): Promise<void> {
    await this.createTablesIfNotExists();
  }

  async writeBookContents(bookName: string, bookContents: string): Promise<number> {
    const runResult = await this.run(`
      INSERT INTO books (name, contents, status) VALUES ($bookName, $bookContents, 0)
    `, {
      $bookName: bookName,
      $bookContents: bookContents
    });
    return runResult.lastID;
  }

  async writeWords(bookId: number, wordAndPosList: Map<string, number[]>): Promise<void> {
    const sqlList = this.getInsertWordsSqlList(bookId, wordAndPosList);
    for (const sql of sqlList) {
      await this.run(sql);
    }
  }

  private getInsertWordsSqlList(bookId: number, wordAndPosList: Map<string, number[]>): string[] {
    const sqlList = [];
    const sqlSuffix: string[] = [];
    wordAndPosList.forEach((posList: number[], word: string) => {
      sqlSuffix.push(`(${bookId}, "${word}", "${posList.join(",")}", 0)`);
    });

    const rowCountPerInsert = 2;
    const sqlPrefix = "INSERT INTO words (book_id, word, positions, status) VALUES";
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
        positions TEXT,
        status INT -- -1: deleted, 0: unknown, 1: known
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

  private async all(sql: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

}