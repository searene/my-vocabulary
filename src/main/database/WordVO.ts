export class WordVO {

  /**
   * Word shown in the book.
   */
  private _changedWord: string;

  /**
   * The original form of {@code changedWord}
   */
  private _originalWord: string;

  private _contextList: string[];

  constructor(changedWord: string, originalWord: string, contextList: string[]) {
    this._changedWord = changedWord;
    this._originalWord = originalWord;
    this._contextList = contextList;
  }

  get changedWord(): string {
    return this._changedWord;
  }

  set changedWord(value: string) {
    this._changedWord = value;
  }

  get originalWord(): string {
    return this._originalWord;
  }

  set originalWord(value: string) {
    this._originalWord = value;
  }

  get contextList(): string[] {
    return this._contextList;
  }

  set contextList(value: string[]) {
    this._contextList = value;
  }
}