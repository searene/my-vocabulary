import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { CardTypeRepository } from "../../infrastructure/repository/CardTypeRepository";
import { ConfigRepository } from "../../infrastructure/repository/ConfigRepository";
import { assert } from "../../utils/Assert";

export class CardType {
  private static _initiated = false;

  private constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string
  ) {}

  static async build(id: number, name: string): Promise<CardType> {
    if (!this._initiated) {
      await this.insertDefaultCardTypeIfNotExist();
      this._initiated = true;
    }
    return new CardType(id, name);
  }

  static async insertDefaultCardTypeIfNotExist(): Promise<void> {
    const configRepository: ConfigRepository = container.get(
      types.ConfigRepository
    );
    const cardTypeRepository: CardTypeRepository = container.get(
      types.CardTypeRepository
    );
    const configDOs = await configRepository.query({});
    assert(
      configDOs.length <= 1,
      "configDOs.length should be less than or equal to 1"
    );
    if (configDOs.length === 0) {
      const defaultCardType = await cardTypeRepository.insert({
        name: "default",
      });
      await configRepository.insert({ defaultCardTypeId: defaultCardType.id });
    } else if (configDOs[0].defaultCardTypeId === undefined) {
      const defaultCardType = await cardTypeRepository.insert({
        name: "default",
      });
      await configRepository.updateById(configDOs[0].id as number, {
        defaultCardTypeId: defaultCardType.id,
      });
    }
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
