import { BookVO } from "./domain/BookVO";
import { Optional } from "typescript-optional";

export interface BookService {
  addBook(filePath: string): Promise<BookVO>;
  getBooks(): Promise<BookVO[]>;
  getBook(bookId: number): Promise<BookVO>;
  getFirstBook(): Promise<Optional<BookVO>>;
  removeBook(bookId: number): Promise<void>;
}
