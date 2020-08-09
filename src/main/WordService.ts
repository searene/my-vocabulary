import { WordVO } from "./database/WordVO";
import { WordStatus } from "./enum/WordStatus";
import { WordQuery } from "./domain/WordQuery";
import { WordCount } from "./domain/WordCount";
import { WordContextStep } from "./domain/WordContextStep";

export interface WordService {
  getWords(
    bookId: number,
    wordStatus: WordStatus,
    pageNo: number,
    pageSize: number,
    contextStep: WordContextStep,
    contextLimit: number
  ): Promise<WordVO[]>;

  updateWord(wordQuery: WordQuery): Promise<void>;

  getWordCount(bookId: number): Promise<WordCount>;
}
