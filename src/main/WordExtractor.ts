import { Word } from "./domain/Word";

export class WordExtractor implements IterableIterator<Word> {
  private _contents: string;
  private _currentPos = -1;
  private static splitters = "\n↵\"',:.[]/#* \t()-_{};~$1234567890";
  private _currentWord = "";

  constructor(contents: string) {
    this._contents = contents;
  }

  [Symbol.iterator](): IterableIterator<Word> {
    return this;
  }

  next(): IteratorResult<Word> {
    while (++this._currentPos < this._contents.length) {
      const currentChar = this._contents[this._currentPos];
      if (WordExtractor.splitters.indexOf(currentChar) == -1) {
        // part of the previous word
        this._currentWord += currentChar;
      } else if (this._currentWord != "") {
        const word = this.getWord(this._currentWord, this._currentPos);
        this._currentWord = "";
        return {
          done: false,
          value: word,
        };
      }
    }
    if (this._currentWord == "") {
      return {
        done: true,
        value: null,
      };
    } else {
      const word = this.getWord(this._currentWord, this._currentPos);
      this._currentWord = "";
      return {
        done: false,
        value: word,
      };
    }
  }

  private getWord(currentWord: string, currentPos: number): Word {
    return new Word(
      currentWord.trim().toLowerCase(),
      currentPos - currentWord.length
    );
  }
}
