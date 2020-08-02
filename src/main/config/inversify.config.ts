import {Container} from 'inversify';
import { WordFormReader } from "../WordFormReader";
import { SqliteDatabaseService } from "../database/SqliteDatabaseService";
import { DatabaseService } from "../database/DatabaseService";
import { ConfigReader } from "../ConfigReader";
import { WordService } from "../WordService";

export const TYPES = {
  DatabaseService: Symbol.for("DatabaseService")
};

export const container = new Container();

container.bind<WordService>(WordService).to(WordService);
container.bind(WordFormReader).to(WordFormReader);
container.bind<DatabaseService>(TYPES.DatabaseService).to(SqliteDatabaseService);
container.bind(ConfigReader).to(ConfigReader);
