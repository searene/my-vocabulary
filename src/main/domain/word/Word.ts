import { WordStatus } from "../../enum/WordStatus";

export class Word {
  constructor(
    private readonly _id: number,
    private readonly _bookId: number,
    private readonly _originalWord: string,
    private readonly _positions: number[],
    private readonly _status: WordStatus
  ) {}

  public get status(): WordStatus {
    return this._status;
  }
  public get positions(): number[] {
    return this._positions;
  }
  public get originalWord(): string {
    return this._originalWord;
  }
  public get bookId(): number {
    return this._bookId;
  }
  public get id(): number {
    return this._id;
  }
}
