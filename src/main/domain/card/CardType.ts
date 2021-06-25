import { CardTypeDO } from "../../infrastructure/do/CardTypeDO";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { ConfigRepository } from "../../infrastructure/repository/ConfigRepository";
import { CardTypeRepository } from "../../infrastructure/repository/CardTypeRepository";

export class CardType {
  private constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string
  ) { }

  static get(id: number, name: string): CardType {
    return new CardType(id, name);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  static fromCardTypeDO(cardTypeDO: CardTypeDO): CardType {
    return CardType.get(cardTypeDO.id as number, cardTypeDO.name as string);
  }

  static async createSimpleCardType(): Promise<CardType> {
    const cardTypeRepo = await container.getAsync<CardTypeRepository>(types.CardTypeRepository);
    const simpleCardTypeDO = await cardTypeRepo.queryOne({ name: "simple" });
    if (simpleCardTypeDO !== undefined) {
      return CardType.fromCardTypeDO(simpleCardTypeDO);
    }
    const cardTypeDO = await cardTypeRepo.upsert({
      name: "simple",
    });
    const configRepo = await container.getAsync<ConfigRepository>(types.ConfigRepository);
    await configRepo.setDefaultCardTypeId(cardTypeDO.id as number);
    return CardType.fromCardTypeDO(cardTypeDO);
  }

  static async createStandardCardType(): Promise<CardType> {
    const cardTypeRepo = await container.getAsync<CardTypeRepository>(types.CardTypeRepository);
    const standardCardDO = await cardTypeRepo.queryOne({ name: "standard" });
    if (standardCardDO !== undefined) {
      return CardType.fromCardTypeDO(standardCardDO);
    }
    const cardTypeDO = await cardTypeRepo.upsert({
      name: "standard",
    });
    const configRepo = await container.getAsync<ConfigRepository>(types.ConfigRepository);
    await configRepo.setDefaultCardTypeId(cardTypeDO.id as number);
    return CardType.fromCardTypeDO(cardTypeDO);

  }
}
