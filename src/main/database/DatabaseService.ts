export interface DatabaseService {

  init(): Promise<void>;

  writeBookContents(bookName: string, bookContents: string): Promise<void>;

  writeWords(wordAndPosList: Map<string, number[]>): Promise<void>;

}