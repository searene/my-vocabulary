import { BookVO } from "./domain/BookVO";

export interface BookService {
  addBook(filePath: string): Promise<number>;
  getBooks(): Promise<BookVO[]>;
}