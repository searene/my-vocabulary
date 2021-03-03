import * as path from "path";
import * as fs from 'fs-extra';
import { StringUtils } from "../utils/StringUtils";
import { container } from "../config/inversify.config";
import { BookService } from "../BookService";
import { types } from "../config/types";
import { BookRepository } from "../infrastructure/repository/BookRepository";
import { injectable } from "@parisholley/inversify-async";
import { FileUtils } from "../../renderer/utils/FileUtils";
import { Configs } from "../config/Configs";

@injectable()
export class ImportKnownWordsService {

  private static importBookPath = path.join(Configs.get().getConfDir(), "import.txt");

  async import(importWords: string[]): Promise<void> {
    const previousImportKnownWords = await this.getPreviousImportKnownWords();
    const finalWords = new Set<string>([...importWords, ...previousImportKnownWords]);
    const importFileContents = Array.from(finalWords).join("\n");
    await fs.writeFile(ImportKnownWordsService.importBookPath, importFileContents, {
      encoding: "UTF-8",
    });
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDO = await bookRepo.queryOne({ type: "import" });
    console.log(bookDO);
    const bookService = await container.getAsync<BookService>(types.BookService);
    if (bookDO !== undefined) {
      await bookService.removeBook(bookDO.id as number);
    }
    await bookService.addBook(ImportKnownWordsService.importBookPath, "import");
  }

  private async getPreviousImportKnownWords(): Promise<Set<string>> {
    if (!(await FileUtils.exists(ImportKnownWordsService.importBookPath))) {
      return new Set();
    }
    const importBookContents = await fs.readFile(ImportKnownWordsService.importBookPath, "utf8");
    return new Set(importBookContents.split("\n")
      .map(line => StringUtils.trimEndingLineSeparatorIfExists(line)));
  }
}