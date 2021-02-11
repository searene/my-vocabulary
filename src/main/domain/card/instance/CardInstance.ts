import { CardInstanceDO } from "../../../infrastructure/do/CardInstanceDO";

export class CardInstance {
  constructor(
    private readonly _id: number,
    private readonly _compositionId: number,
    private readonly _cardId: number,
    private readonly _dueTime: Date,
    private readonly _book_id: number
  ) {}

  get id(): number {
    return this._id;
  }

  get compositionId(): number {
    return this._compositionId;
  }

  get cardId(): number {
    return this._cardId;
  }

  get dueTime(): Date {
    return this._dueTime;
  }

  get book_id(): number {
    return this._book_id;
  }

  static async fromCardInstanceDO(
    cardInstanceDO: CardInstanceDO
  ): Promise<CardInstance> {
    return Promise.resolve(
      new CardInstance(
        cardInstanceDO.id as number,
        cardInstanceDO.compositionId as number,
        cardInstanceDO.cardId as number,
        cardInstanceDO.dueTime as Date,
        cardInstanceDO.bookId as number
      )
    );
  }

  static getNextDueCardInstance(
    bookId: number
  ): Promise<CardInstance | undefined> {
    throw new Error("not implemented");
  }

  static getTotalDueCardInstanceCount(bookId: number): Promise<number> {
    throw new Error("not implemented");
  }
}
