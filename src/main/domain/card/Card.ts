export class Card {
  public constructor(
    private readonly _id: number,
    private readonly _bookId: number,
    private readonly _cardTypeId: number
  ) {}

  public get id(): number {
    return this._id;
  }
  public get cardTypeId(): number {
    return this._cardTypeId;
  }
  public get bookId(): number {
    return this._bookId;
  }
}
