import { List } from 'immutable';

export class WordFormLine {
    private _originalWord = '';

    private _changedWordList: List<string> = List();

    get originalWord(): string {
        return this._originalWord;
    }

    set originalWord(value: string) {
        this._originalWord = value;
    }

    get changedWordList(): List<string> {
        return this._changedWordList;
    }

    set changedWordList(value: List<string>) {
        this._changedWordList = value;
    }
}
