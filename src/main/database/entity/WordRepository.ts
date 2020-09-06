import "reflect-metadata";
import { IWordRepository } from "./IWordRepository";
import {
  createConnection,
  Entity,
  FindConditions,
  getRepository,
} from "typeorm";
import { Word } from "./Word";
import { WordQuery } from "../../domain/WordQuery";
import { WordDO } from "../../domain/WordDO";
import { existsSync, mkdirSync } from "fs";
import * as os from "os";
import { join } from "path";
import { injectable } from "inversify";

@injectable()
export class WordRepository implements IWordRepository {
  async find(wordQuery: WordQuery): Promise<Word[]> {
    const dir = join(os.homedir(), ".my-vocabulary");
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    await createConnection({
      type: "sqlite",
      database: join(dir, "vocabulary.db"),
    });
    const wordRepository = getRepository(Word);
    return wordRepository.find(wordQuery);
  }
}
