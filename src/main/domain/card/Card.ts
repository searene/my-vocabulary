import "reflect-metadata";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { CardRepository } from "../../infrastructure/repository/CardRepository";
import { CardDO } from "../../infrastructure/do/CardDO";
import { assert } from "../../utils/Assert";

export class Card {
  private static _cardRepository: CardRepository = container.get(
    types.CardRepository
  );

  public constructor(
    private readonly _id: number,
    private readonly _bookId: number,
    private readonly _cardTypeId: number
  ) {}

  /**
   * @param fieldContents fieldTypeId -> field contents
   */
  static async createCard(bookId: number, cardTypeId?: number): Promise<Card> {
    const insertedCardDO = await Card._cardRepository.insert({
      cardTypeId,
      bookId,
    });
    return Card.fromCardDO(insertedCardDO);
  }

  static async getById(id: number): Promise<Card> {
    const cardDOs = await Card._cardRepository.query({ id });
    assert(cardDOs.length === 1, "cardDOs.length should be 1");
    return Card.fromCardDO(cardDOs[0]);
  }

  static fromCardDO(cardDO: CardDO): Card {
    return new Card(
      cardDO.id as number,
      cardDO.bookId as number,
      cardDO.cardTypeId as number
    );
  }

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
