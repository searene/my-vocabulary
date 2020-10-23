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
import { KnexConfigRepository } from "../infrastructure/repository/knex/KnexConfigRepository";
import { CardFacadeImpl } from "../facade/CardFacadeImpl";
import { CardTypeRepository } from "../infrastructure/repository/CardTypeRepository";
import { KnexCardTypeRepository } from "../infrastructure/repository/knex/KnexCardTypeRepository";
import { KnexCardRepository } from "../infrastructure/repository/knex/KnexCardRepository";
import { CardRepository } from "../infrastructure/repository/CardRepository";
import { KnexFieldTypeRepository } from "../infrastructure/repository/knex/KnexFieldTypeRepository.1";
import { FieldTypeRepository } from "../infrastructure/repository/FieldTypeRepository";
import { WordRepository } from "../infrastructure/repository/WordRepository";
import { KnexWordRepository } from "../infrastructure/repository/knex/KnexWordRepository";

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
  .to(KnexConfigRepository);
container
  .bind<CardTypeRepository>(types.CardTypeRepository)
  .to(KnexCardTypeRepository);
container
  .bind<FieldTypeRepository>(types.FieldTypeRepository)
  .to(KnexFieldTypeRepository);
container.bind<CardRepository>(types.CardRepository).to(KnexCardRepository);
container.bind<WordRepository>(types.WordRepository).to(KnexWordRepository);

export type WordRepositoryProvider = () => Promise<WordRepository>;

container
  .bind<WordRepositoryProvider>(types.WordRepositoryProvider)
  .toProvider<WordRepository>(context => {
    return async () => {
      const wordRepository = context.container.get<WordRepository>(
        types.WordRepository
      );
      await wordRepository.createTableIfNotExists();
      await wordRepository.updateWordStatus();
      return wordRepository;
    };
  });
