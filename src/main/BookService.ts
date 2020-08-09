import { BookVO } from "./domain/BookVO";

export interface BookService {
  addBook(filePath: string): Promise<BookVO>;
  getBooks(): Promise<BookVO[]>;
  getBook(bookId: number): Promise<BookVO>;
}
