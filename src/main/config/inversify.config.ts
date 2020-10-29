import "reflect-metadata";
import { CardFacade } from "./../facade/CardFacade";
import { Container } from "@parisholley/inversify-async";
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
import { CardFacadeImpl } from "../facade/CardFacadeImpl";
import { CardTypeRepository } from "../infrastructure/repository/CardTypeRepository";
import { KnexCardTypeRepository } from "../infrastructure/repository/knex/KnexCardTypeRepository";
import { KnexCardRepository } from "../infrastructure/repository/knex/KnexCardRepository";
import { CardRepository } from "../infrastructure/repository/CardRepository";
import { FieldTypeRepository } from "../infrastructure/repository/FieldTypeRepository";
import { WordRepository } from "../infrastructure/repository/WordRepository";
import { KnexWordRepository } from "../infrastructure/repository/knex/KnexWordRepository";
import { KnexConfigRepository } from "../infrastructure/repository/knex/KnexConfigRepository";
import { KnexFieldTypeRepository } from "../infrastructure/repository/knex/KnexFieldTypeRepository";
import { CompositionRepository } from "../infrastructure/repository/CompositionRepository";
import { KnexCompositionRepository } from "../infrastructure/repository/knex/KnexCompositionRepository";
import { FieldRepository } from "../infrastructure/repository/FieldRepository";
import { KnexFieldRepository } from "../infrastructure/repository/knex/KnexFieldRepository";

export const container = new Container({
  defaultScope: "Singleton",
});

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
  .to(KnexConfigRepository)
  .onActivation(async (_, configRepository) => {
    await configRepository.init();
    return configRepository;
  });
container
  .bind<CardTypeRepository>(types.CardTypeRepository)
  .to(KnexCardTypeRepository)
  .onActivation(async (_, cardRepository) => {
    await cardRepository.init();
    return cardRepository;
  });
container
  .bind<FieldTypeRepository>(types.FieldTypeRepository)
  .to(KnexFieldTypeRepository)
  .onActivation(async (_, fieldTypeRepository) => {
    await fieldTypeRepository.init();
    return fieldTypeRepository;
  });
container
  .bind<FieldRepository>(types.FieldRepository)
  .to(KnexFieldRepository)
  .onActivation(async (_, fieldRepository) => {
    await fieldRepository.init();
    return fieldRepository;
  });
container
  .bind<CardRepository>(types.CardRepository)
  .to(KnexCardRepository)
  .onActivation(async (_, cardRepository) => {
    await cardRepository.init();
    return cardRepository;
  });
container
  .bind<WordRepository>(types.WordRepository)
  .to(KnexWordRepository)
  .onActivation(async (_, wordRepository) => {
    await wordRepository.init();
    return wordRepository;
  });
container
  .bind<CompositionRepository>(types.CompositionRepository)
  .to(KnexCompositionRepository)
  .onActivation(async (_, compositionRepository) => {
    await compositionRepository.init();
    return compositionRepository;
  });
