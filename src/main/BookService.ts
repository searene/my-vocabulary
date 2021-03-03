import { BookVO } from "./domain/BookVO";
import { Optional } from "typescript-optional";
import { BookType } from "./infrastructure/do/BookDO";

export interface BookService {
  addBook(filePath: string, type: BookType): Promise<BookVO>;
  getNormalBooks(): Promise<BookVO[]>;
  getBook(bookId: number): Promise<BookVO>;
  getFirstNormalBook(): Promise<BookVO | undefined>;
  removeBook(bookId: number): Promise<void>;
}
