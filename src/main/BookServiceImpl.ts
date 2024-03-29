import { BookService } from "./BookService";
import { BookVO, convertBookDOToBookVO } from "./domain/BookVO";
import { container } from "./config/inversify.config";
import { types } from "./config/types";
import { BookRepository } from "./infrastructure/repository/BookRepository";
import { EBookReadAgent } from "./EBookReadAgent";
import * as path from "path";
import { WordFactory } from "./domain/card/factory/WordFactory";
import { BookDO, BookType } from "./infrastructure/do/BookDO";
import { injectable } from "@parisholley/inversify-async";
import { WordService } from "./WordService";
import { WordFormReader } from "./WordFormReader";

@injectable()
export class BookServiceImpl implements BookService {
  async addBook(filePath: string, type: BookType): Promise<BookVO> {
    const contents = await EBookReadAgent.readAllContents(filePath);
    if (contents == undefined) {
      throw new Error("plainContents not available");
    }

    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO: BookDO = await bookRepo.upsert({
      name: path.parse(filePath).name,
      contents,
      type
    });
    const wordToPositionsMap = await EBookReadAgent.readAllWords(filePath);
    const wordToOriginalWordMap = await container.get(WordFormReader).getWordToOriginalWordMap(Array.from(wordToPositionsMap.keys()));
    const originalWordToPositionsMap = this.toOriginalWordMap(wordToPositionsMap, wordToOriginalWordMap);
    for (const [originalWord, wordWithPositions] of originalWordToPositionsMap) {
      await WordFactory.get().createWord(bookDO.id as number, originalWord, wordWithPositions);
    }
    return await convertBookDOToBookVO(bookDO);
  }

  async getBook(bookId: number): Promise<BookVO> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO = await bookRepo.queryByIdOrThrow(bookId);
    return await convertBookDOToBookVO(bookDO);
  }

  async getNormalBooks(): Promise<BookVO[]> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDOs = await bookRepo.query({ type: "normal" });
    return Promise.all(bookDOs.map(async bookDO => await convertBookDOToBookVO(bookDO)));
  }

  async getFirstNormalBook(): Promise<BookVO | undefined> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDOs = await bookRepo.query({type: "normal"}, {offset: 0, limit: 1});
    if (bookDOs.length == 0) {
      return undefined;
    }
    return await convertBookDOToBookVO(bookDOs[0]);
  }

  async removeBook(bookId: number): Promise<void> {
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    await bookRepo.deleteById(bookId);
    const wordService = container.get<WordService>(types.WordService);
    await wordService.delete(bookId);
  }

  private toOriginalWordMap(wordToPositionsMap: Map<string, number[]>, wordToOriginalWordMap: Map<string, string>): Map<string, string> {
    const result: Map<string, string> = new Map();
    for (const [word, positions] of wordToPositionsMap) {
      const originalWord = wordToOriginalWordMap.get(word) as string;
      const wordWithPositions = `${word}:${positions.join(",")}`;
      if (result.has(originalWord)) {
        result.set(originalWord, `${result.get(originalWord)};${wordWithPositions}`);
      } else {
        result.set(originalWord, wordWithPositions);
      }
    }
    return result;
  }
}
