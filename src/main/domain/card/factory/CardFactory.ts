import "reflect-metadata";
import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CardDO } from "../../../infrastructure/do/CardDO";
import { CardRepository } from "../../../infrastructure/repository/CardRepository";
import { assert } from "../../../utils/Assert";
import { Card } from "../Card";

export class CardFactory {
  /**
   * @param fieldContents fieldTypeId -> field contents
   */
  async createCard(bookId: number, cardTypeId?: number): Promise<Card> {
    const cardRepository: CardRepository = await container.getAsync(
      types.CardRepository
    );
    const insertedCardDO = await cardRepository.insert({
      cardTypeId,
      bookId,
    });
    return this.fromCardDO(insertedCardDO);
  }

  async getById(id: number): Promise<Card> {
    const cardRepository: CardRepository = await container.getAsync(
      types.CardRepository
    );
    const cardDOs = await cardRepository.query({ id });
    assert(cardDOs.length === 1, "cardDOs.length should be 1");
    return this.fromCardDO(cardDOs[0]);
  }

  fromCardDO(cardDO: CardDO): Card {
    return new Card(
      cardDO.id as number,
      cardDO.bookId as number,
      cardDO.cardTypeId as number
    );
  }
}
