import { inject } from "inversify";
import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { TYPES } from "../../../config/types";
import { ConfigQuery } from "../../../infrastructure/query/ConfigQuery";
import { CardTypeRepository } from "../../../infrastructure/repository/CardTypeRepository";
import { CardTypeDO } from "../../../infrastructure/do/CardTypeDO";
import { CardTypeQuery } from "../../../infrastructure/query/CardTypeQuery";

export class CardTypeFactory {
  constructor(
    @inject(TYPES.ConfigRepository) private configRepository: ConfigRepository,
    @inject(TYPES.CardTypeRepository)
    private cardTypeRepository: CardTypeRepository
  ) {}

  async getDefaultCardType(): Promise<CardType> {
    const configQuery = new ConfigQuery();
    const configDOList = await this.configRepository.query(configQuery);
    if (configDOList.length !== 1) {
      throw new Error("configDOList.length should be 1");
    }
    const cardType = await this.getById(configDOList[0].defaultCardTypeId);
    if (cardType === undefined) {
      throw new Error("The default card type is not available.");
    }
    return cardType as CardType;
  }

  async getById(cardTypeId: number): Promise<CardType | undefined> {
    const query = new CardTypeQuery();
    query.id = cardTypeId;
    const cardTypeDOArray = await this.cardTypeRepository.query(query);
    if (cardTypeDOArray.length !== 1) {
      throw new Error("cardTypes.length should be 1.");
    }
    const cardTypeDO = cardTypeDOArray[0];
    return this.from(cardTypeDO);
  }

  private from(cardTypeDO: CardTypeDO): CardType {
    return new CardType(cardTypeDO.id as number, cardTypeDO.name as string);
  }
}
