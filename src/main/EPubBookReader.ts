import * as EPub from "epub";
import { IEBookReader } from "./IEBookReader";
import { HtmlToText } from "./HtmlToText";

export class EPubBookReader implements IEBookReader {

  private filePath: string;
  private epub: EPub;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.epub = new EPub(filePath)
  }

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.epub.on("end", () => {
        // epub is now usable
        resolve();
      });
      this.epub.parse();
    });
  }

  async readAll(): Promise<string> {
    const chapters = this.getAllChapters();
    let contents = "";
    for (const chapter of chapters) {
      contents += await this.getChapterContents(chapter.id);
    }
    return HtmlToText.toText(contents);
  }

  getAllChapters(): EPub.TocElement[] {
    const chapters: EPub.TocElement[] = [];
    this.epub.flow.forEach(chapter => {
      chapters.push(chapter);
    });
    return chapters;
  }

  async getChapterContents(chapterId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.epub.getChapter(chapterId, (err, text) => {
        if (err) {
          reject(err);
        } else {
          resolve(text);
        }
      });
    });
  }

}