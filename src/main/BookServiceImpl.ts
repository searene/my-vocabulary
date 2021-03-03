import { BookService } from "./BookService";
import { BookVO, convertBookDOToBookVO } from "./domain/BookVO";
import { container } from "./config/inversify.config";
import { types } from "./config/types";
import { BookRepository } from "./infrastructure/repository/BookRepository";
import { EBookReadAgent } from "./EBookReadAgent";
import * as path from "path";
import { WordFactory } from "./domain/card/factory/WordFactory";
import { BookDO, BookType } from "./infrastructure/do/BookDO";
import { WordRepository } from "./infrastructure/repository/WordRepository";
import { injectable } from "@parisholley/inversify-async";

@injectable()
export class BookServiceImpl implements BookService {
  async addBook(filePath: string, type: BookType): Promise<BookVO> {
    const contents = await EBookReadAgent.readAllContents(filePath);
    if (contents == undefined) {
      throw new Error("plainContents not available");
    }

    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO: BookDO = await bookRepo.insert({
      name: path.parse(filePath).name,
      contents,
      type
    });
    const wordToPositionsMap = await EBookReadAgent.readAllWords(filePath);
    for (const [word, positions] of wordToPositionsMap) {
      await WordFactory.get().createWord(bookDO.id as number, word, positions);
    }
    return convertBookDOToBookVO(bookDO);
  }

  async getBook(bookId: number): Promise<BookVO> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO = await bookRepo.queryByIdOrThrow(bookId);
    return convertBookDOToBookVO(bookDO);
  }

  async getNormalBooks(): Promise<BookVO[]> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDOs = await bookRepo.query({ type: "normal" });
    return bookDOs.map(bookDO => convertBookDOToBookVO(bookDO));
  }

  async getFirstNormalBook(): Promise<BookVO | undefined> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDOs = await bookRepo.query({type: "normal"}, {offset: 0, limit: 1});
    if (bookDOs.length == 0) {
      return undefined;
    }
    return convertBookDOToBookVO(bookDOs[0]);
  }

  async removeBook(bookId: number): Promise<void> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    await bookRepo.deleteById(bookId);
    const wordRepo = await container.getAsync<WordRepository>(types.WordRepository);
    await wordRepo.delete({bookId});
  }
}