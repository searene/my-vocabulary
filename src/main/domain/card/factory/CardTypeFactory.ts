import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { types } from "../../../config/types";
import { CardTypeRepository } from "../../../infrastructure/repository/CardTypeRepository";
import { CardType } from "../CardType";
import { container } from "../../../config/inversify.config";

export class CardTypeFactory {
  private static _instance: CardTypeFactory | undefined;

  private constructor() {}

  async getDefaultCardType(): Promise<CardType> {
    const configRepository: ConfigRepository = await container.getAsync(
      types.ConfigRepository
    );
    const configContents = await configRepository.queryConfigContents();
    if (configContents === undefined) {
      throw new Error("configContents are not available");
    }
    const cardType = await this.getById(configContents.defaultCardTypeId as number);
    if (cardType === undefined) {
      throw new Error("The default card type is not available.");
    }
    return cardType as CardType;
  }

  async getById(cardTypeId: number): Promise<CardType | undefined> {
    const cardTypeRepository: CardTypeRepository = await container.getAsync(
      types.CardTypeRepository
    );
    const cardTypeDOArray = await cardTypeRepository.query({
      id: cardTypeId,
    });
    if (cardTypeDOArray.length !== 1) {
      throw new Error("cardTypes.length should be 1.");
    }
    const cardTypeDO = cardTypeDOArray[0];
    return CardType.fromCardTypeDO(cardTypeDO);
  }

  static get() {
    if (this._instance === undefined) {
      this._instance = new CardTypeFactory();
    }
    return this._instance;
  }

  private async getConfigRepository(): Promise<ConfigRepository> {
    return await container.getAsync(types.ConfigRepository);
  }

  private async getCardTypeRepository(): Promise<CardTypeRepository> {
    return await container.getAsync(types.CardTypeRepository);
  }
}
