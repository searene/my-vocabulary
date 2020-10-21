import { WordDO } from "../do/WordDO";
import { WordQuery } from "../query/WordQuery";
import { BaseRepository } from "./BaseRepository";

export interface WordRepository extends BaseRepository<WordQuery, WordDO> {}
