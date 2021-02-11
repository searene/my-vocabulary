import { CardType } from "./CardType";
import { CardDO } from "../../infrastructure/do/CardDO";
import { container } from "../../config/inversify.config";
import { CardTypeRepository } from "../../infrastructure/repository/CardTypeRepository";
import { types } from "../../config/types";

export class Card {
  public constructor(
    private readonly _id: number,
    private readonly _bookId: number,
    private readonly _cardType: CardType
  ) {}

  public get id(): number {
    return this._id;
  }
  public get cardType(): CardType {
    return this._cardType;
  }
  public get bookId(): number {
    return this._bookId;
  }

  static async fromCardDO(cardDO: CardDO): Promise<Card> {
    const cardTypeRepo = await container.getAsync<CardTypeRepository>(
      types.CardTypeRepository
    );
    const cardTypeDO = await cardTypeRepo.queryById(
      cardDO.cardTypeId as number
    );
    if (cardTypeDO == undefined) {
      throw new Error("Invalid cardTypeId: " + cardDO.cardTypeId);
    }
    return new Card(
      cardDO.id as number,
      cardDO.bookId as number,
      CardType.fromCardTypeDO(cardTypeDO)
    );
  }
}
