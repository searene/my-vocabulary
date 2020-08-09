export class WordFormLine {
  private _originalWord = "";

  private _changedWordList: string[] = [];

  get originalWord(): string {
    return this._originalWord;
  }

  set originalWord(value: string) {
    this._originalWord = value;
  }

  get changedWordList(): string[] {
    return this._changedWordList;
  }

  set changedWordList(value: string[]) {
    this._changedWordList = value;
  }
}
