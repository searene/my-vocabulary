import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { types } from "../../../config/types";
import { CardTypeRepository } from "../../../infrastructure/repository/CardTypeRepository";
import { CardTypeDO } from "../../../infrastructure/do/CardTypeDO";
import { CardType } from "../CardType";
import { assert } from "../../../utils/Assert";
import { container } from "../../../config/inversify.config";

export class CardTypeFactory {
  private _configRepository: ConfigRepository = container.get(
    types.ConfigRepository
  );
  private _cardTypeRepository: CardTypeRepository = container.get(
    types.CardTypeRepository
  );

  private static _instance: CardTypeFactory | undefined;

  private constructor() {}

  async getDefaultCardType(): Promise<CardType> {
    const configDOList = await this._configRepository.query({});
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
    const cardTypeDOArray = await this._cardTypeRepository.query({
      id: cardTypeId,
    });
    if (cardTypeDOArray.length !== 1) {
      throw new Error("cardTypes.length should be 1.");
    }
    const cardTypeDO = cardTypeDOArray[0];
    return await this.from(cardTypeDO);
  }

  async getDefaultCardTypeId(): Promise<number> {
    const configDOs = await this._configRepository.query({});
    assert(configDOs.length !== 1, "configDOs.length should be 1");
    const defaultCardTypeId = configDOs[0].defaultCardTypeId;
    assert(defaultCardTypeId !== undefined, "defaultCardTypeId is undefined.");
    return defaultCardTypeId;
  }

  static get() {
    if (this._instance === undefined) {
      this._instance = new CardTypeFactory();
    }
    return this._instance;
  }
  private async from(cardTypeDO: CardTypeDO): Promise<CardType> {
    return await CardType.build(
      cardTypeDO.id as number,
      cardTypeDO.name as string
    );
  }
}
