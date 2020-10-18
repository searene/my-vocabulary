import { Card } from "./../domain/card/Card";
import { CardFacade } from "./../facade/CardFacade";
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
import { CardFacadeImpl } from "../facade/CardFacadeImpl";
import { CardTypeRepository } from "../infrastructure/repository/CardTypeRepository";
import { KnexCardTypeRepository } from "../infrastructure/repository/knex/KnexCardTypeRepository";
import { KnexCardRepository } from "../infrastructure/repository/knex/KnexCardRepository";
import { CardRepository } from "../infrastructure/repository/CardRepository";

export const container = new Container();

container.bind<WordService>(TYPES.WordService).to(WordServiceImpl);
container.bind(WordFormReader).to(WordFormReader);
container
  .bind<DatabaseService>(TYPES.DatabaseService)
  .to(SqliteDatabaseService);
container.bind(ConfigReader).to(ConfigReader);
container.bind<BookService>(TYPES.BookService).to(BookServiceImpl);
container.bind<CardFacade>(TYPES.CardFacade).to(CardFacadeImpl);
container
  .bind<ConfigRepository>(TYPES.ConfigRepository)
  .to(KnexConfigRepository);
container
  .bind<CardTypeRepository>(TYPES.CardTypeRepository)
  .to(KnexCardTypeRepository);
container
  .bind<FieldTypeRepository>(TYPES.FieldTypeRepository)
  .to(KnexFieldTypeRepository);
container.bind<CardRepository>(TYPES.CardRepository).to(KnexCardRepository);
