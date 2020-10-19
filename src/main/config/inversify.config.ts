import { Card } from "./../domain/card/Card";
import { CardFacade } from "./../facade/CardFacade";
import "reflect-metadata";
import { Container } from "inversify";
import { WordFormReader } from "../WordFormReader";
import { SqliteDatabaseService } from "../database/SqliteDatabaseService";
import { DatabaseService } from "../database/DatabaseService";
import { ConfigReader } from "../ConfigReader";
import { WordServiceImpl } from "../WordServiceImpl";
import { types } from "./types";
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
import { KnexFieldTypeRepository } from "../infrastructure/repository/knex/KnexFieldTypeRepository";
import { FieldTypeRepository } from "../infrastructure/repository/FieldTypeRepository";

export const container = new Container();

container.bind<WordService>(types.WordService).to(WordServiceImpl);
container.bind(WordFormReader).to(WordFormReader);
container
  .bind<DatabaseService>(types.DatabaseService)
  .to(SqliteDatabaseService);
container.bind(ConfigReader).to(ConfigReader);
container.bind<BookService>(types.BookService).to(BookServiceImpl);
container.bind<CardFacade>(types.CardFacade).to(CardFacadeImpl);
container
  .bind<ConfigRepository>(types.ConfigRepository)
  .to(KnexConfigRepository);
container
  .bind<CardTypeRepository>(types.CardTypeRepository)
  .to(KnexCardTypeRepository);
container
  .bind<FieldTypeRepository>(types.FieldTypeRepository)
  .to(KnexFieldTypeRepository);
container.bind<CardRepository>(types.CardRepository).to(KnexCardRepository);
