import { WordVO } from "./database/WordVO";
import { WordStatus } from "./enum/WordStatus";
import { WordQuery } from "./domain/WordQuery";

export interface WordService {
  getWords(
    bookId: number,
    wordStatus: WordStatus,
    pageNo: number,
    pageSize: number,
    contextStep: number,
    contextLimit: number
  ): Promise<WordVO[]>;

  updateWord(wordQuery: WordQuery): Promise<void>;
}
