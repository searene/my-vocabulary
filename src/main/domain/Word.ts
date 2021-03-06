export class Word {
  private _word: string;

  /**
   * Position of the word in the book, starting with 0.
   */
  private _pos: number;

  constructor(word: string, pos: number) {
    this._word = word;
    this._pos = pos;
  }

  get pos(): number {
    return this._pos;
  }

  set pos(value: number) {
    this._pos = value;
  }

  get word(): string {
    return this._word;
  }

  set word(value: string) {
    this._word = value;
  }
}
