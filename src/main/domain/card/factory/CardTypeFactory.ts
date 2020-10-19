import { inject } from "inversify";
import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";
import { types } from "../../../config/types";
import { CardTypeRepository } from "../../../infrastructure/repository/CardTypeRepository";
import { CardTypeDO } from "../../../infrastructure/do/CardTypeDO";
import { CardType } from "../CardType";

export class CardTypeFactory {
  constructor(
    @inject(types.ConfigRepository) private configRepository: ConfigRepository,
    @inject(types.CardTypeRepository)
    private cardTypeRepository: CardTypeRepository
  ) {}

  async getDefaultCardType(): Promise<CardType> {
    const configDOList = await this.configRepository.query({});
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
    const cardTypeDOArray = await this.cardTypeRepository.query({
      id: cardTypeId,
    });
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
