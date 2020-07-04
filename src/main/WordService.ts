import { WordVO } from "./database/WordVO";
import "reflect-metadata";
import { inject, singleton } from "tsyringe";
import { DatabaseService } from "./database/DatabaseService";

@singleton()
export class WordService {

  constructor(@inject("databaseService") private databaseService: DatabaseService) {}

  getUnknownWords(bookId: number): Promise<WordVO[]> {
  }
}