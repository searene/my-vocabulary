import { DatabaseService } from "./DatabaseService";
import * as sqliteImport from 'sqlite3';
import * as os from 'os';
import {join} from 'path';
import { Database } from "sqlite3";
import {existsSync, mkdirSync} from 'fs';

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

  async writeBookContents(bookName: string, bookContents: string): Promise<void> {
    await this.run(`
      INSERT INTO books (name, contents, status) VALUES ($bookName, $bookContents, 0)
    `, {
      $bookName: bookName,
      $bookContents: bookContents
    });
  }

  async writeWords(wordAndPosList: Map<string, number[]>): Promise<void> {
    return undefined;
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
        contents TEXT,
        positions TEXT,
        status INT -- 0: normal, -1: deleted
      )
    `);
  }

  private async run(sql: string, params?: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err != null) {
          reject(err);
        } else {
          resolve();
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
        }
      );
    });
  }

}