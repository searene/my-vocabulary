export class Field {
  constructor(
    private readonly _id: number,
    private readonly _contents: string,
    private readonly _fieldTypeId: number,
    private readonly _cardId: number
  ) {}

  public get fieldTypeId(): number {
    return this._fieldTypeId;
  }
  public get contents(): string {
    return this._contents;
  }
  public get id(): number {
    return this._id;
  }
  public get cardId(): number {
    return this._cardId;
  }
}
