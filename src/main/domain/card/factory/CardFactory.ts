import "reflect-metadata";
import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CardRepository } from "../../../infrastructure/repository/CardRepository";
import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { assert } from "../../../utils/Assert";
import { Card } from "../Card";

export class CardFactory {
  async createCard(bookId: number, word: string, cardTypeId?: number): Promise<Card> {
    const cardRepository = await this.getCardRepository();
    if (cardTypeId === undefined) {
      const configRepository = await this.getConfigRepository();
      cardTypeId = await configRepository.getDefaultCardTypeId();
    }
    const insertedCardDO = await cardRepository.upsert({
      cardTypeId,
      bookId,
      word,
      createTime: new Date().getTime(),
    });
    return await Card.fromCardDO(insertedCardDO);
  }

  async getById(id: number): Promise<Card> {
    const cardRepository: CardRepository = await container.getAsync(
      types.CardRepository
    );
    const cardDOs = await cardRepository.query({ id });
    assert(cardDOs.length === 1, "cardDOs.length should be 1");
    return await Card.fromCardDO(cardDOs[0]);
  }

  private async getCardRepository() {
    return await container.getAsync<CardRepository>(types.CardRepository);
  }

  private async getConfigRepository() {
    return await container.getAsync<ConfigRepository>(types.ConfigRepository);
  }
}
