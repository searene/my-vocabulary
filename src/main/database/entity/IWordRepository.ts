import { Word } from "./Word";
import { WordQuery } from "../../domain/WordQuery";

export interface IWordRepository {
  find(wordQuery: WordQuery): Promise<Word[]>;
}
