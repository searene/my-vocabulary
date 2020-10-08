import "reflect-metadata";
import { Container } from "inversify";
import { WordFormReader } from "../WordFormReader";
import { SqliteDatabaseService } from "../database/SqliteDatabaseService";
import { DatabaseService } from "../database/DatabaseService";
import { ConfigReader } from "../ConfigReader";
import { WordServiceImpl } from "../WordServiceImpl";
import { TYPES } from "./types";
import { BookServiceImpl } from "../BookServiceImpl";
import { BookService } from "../BookService";
import { WordService } from "../WordService";
import { ConfigRepository } from "../infrastructure/repository/ConfigRepository";
import { KnexConfigRepository } from "../infrastructure/repository/knex/KnexConfigRepository";

export const container = new Container();

container.bind<WordService>(TYPES.WordService).to(WordServiceImpl);
container.bind(WordFormReader).to(WordFormReader);
container
  .bind<DatabaseService>(TYPES.DatabaseService)
  .to(SqliteDatabaseService);
container.bind(ConfigReader).to(ConfigReader);
container.bind<BookService>(TYPES.BookService).to(BookServiceImpl);
container
  .bind<ConfigRepository>(TYPES.ConfigRepository)
  .to(KnexConfigRepository);
