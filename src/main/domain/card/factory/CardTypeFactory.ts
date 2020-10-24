import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { types } from "../../../config/types";
import { CardTypeRepository } from "../../../infrastructure/repository/CardTypeRepository";
import { CardTypeDO } from "../../../infrastructure/do/CardTypeDO";
import { CardType } from "../CardType";
import { container } from "../../../config/inversify.config";

export class CardTypeFactory {
  private static _instance: CardTypeFactory | undefined;

  private constructor() {}

  async getDefaultCardType(): Promise<CardType> {
    const configRepository: ConfigRepository = await container.getAsync(
      types.ConfigRepository
    );
    const configDOList = await configRepository.query({});
    if (configDOList.length !== 1) {
      throw new Error("configDOList.length should be 1");
    }
    const cardType = await this.getById(
      configDOList[0].defaultCardTypeId as number
    );
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
    return this.fromCardTypeDO(cardTypeDO);
  }

  async createInitialCardType(): Promise<CardType> {
    const configRepository = await this.getConfigRepository();
    const defaultCardTypeId = await configRepository.getDefaultCardTypeId();
    const cardTypeRepository = await this.getCardTypeRepository();
    if (defaultCardTypeId !== undefined) {
      cardTypeRepository.query({
        id: defaultCardTypeId,
      });
    }
    const cardTypeDO = await cardTypeRepository.insert({
      name: "normal",
    });
    return this.fromCardTypeDO(cardTypeDO);
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

  private fromCardTypeDO(cardTypeDO: CardTypeDO): CardType {
    return CardType.get(cardTypeDO.id as number, cardTypeDO.name as string);
  }
}
