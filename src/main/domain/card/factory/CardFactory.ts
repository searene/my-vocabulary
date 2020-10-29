import "reflect-metadata";
import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { ConfigReader } from "../../../ConfigReader";
import { CardDO } from "../../../infrastructure/do/CardDO";
import { CardRepository } from "../../../infrastructure/repository/CardRepository";
import { CardTypeRepository } from "../../../infrastructure/repository/CardTypeRepository";
import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { assert } from "../../../utils/Assert";
import { Card } from "../Card";

export class CardFactory {
  /**
   * @param fieldContents fieldTypeId -> field contents
   */
  async createCard(bookId: number, cardTypeId?: number): Promise<Card> {
    const cardRepository = await this.getCardRepository();
    if (cardTypeId === undefined) {
      const configRepository = await this.getConfigRepository();
      cardTypeId = await configRepository.getDefaultCardTypeId();
    }
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

  private async getCardRepository() {
    return await container.getAsync<CardRepository>(types.CardRepository);
  }

  private async getConfigRepository() {
    return await container.getAsync<ConfigRepository>(types.ConfigRepository);
  }

  fromCardDO(cardDO: CardDO): Card {
    return new Card(
      cardDO.id as number,
      cardDO.bookId as number,
      cardDO.cardTypeId as number
    );
  }
}
