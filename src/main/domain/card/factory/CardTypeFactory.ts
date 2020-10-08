import { inject } from "inversify";
import { ConfigRepository } from "../../../infrastructure/repository/ConfigRepository";

export class CardTypeFactory {
  constructor(
    @inject(ConfigRepository) private configRepository: ConfigRepository,
    @inject(CardTypeRepository) private cardTypeRepository: CardTypeRepository,
    @inject(CompositionFactory) private compositionFactory: CompositionFactory
  ) {}

  async getDefaultCardType(): Promise<CardType> {
    const configQuery = new ConfigQuery();
    const configDO = this.configRepository.query(configQuery);
    const defaultCardTypeId = configDO.getDefaultCardTypeId();
    const cardType = await getById();
    if (cardType === undefined) {
      throw new Error("The default card type is not available.");
    }
    return cardType as CardType;
  }

  async getById(cardTypeId: number): Promise<CardType | undefined> {
    const query = new CardTypeQuery();
    query.setId(cardTypeId);
    const cardTypeDOArray = this.cardTypeRepository.query(query);
    if (cardTypeDOArray.length !== 1) {
      throw new Error("cardTypes.length should be 1.");
    }
    const cardTypeDO = cardTypeDOArray[0];
    return await this.from(cardTypeDO);
  }

  private async from(cardTypeDO: CardTypeDO): CardType {
    const compositionArray: Composition[] = [];
    for (const compositionId of cardTypeDO.getCompositionIdArray()) {
      const composition = await this.compositionFactory.getById(compositionId);
      if (composition === undefined) {
        throw new Error("composition is not available, id: " + compositionId);
      }
      compositionArray.push(composition);
    }
    return new CardType(
      cardTypeDO.getId(),
      cardTypeDO.getName(),
      compositionArray
    );
  }
}
