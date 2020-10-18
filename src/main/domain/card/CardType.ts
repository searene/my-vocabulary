import { inject } from "inversify";
import { TYPES } from "../../config/types";
import { ConfigQuery } from "../../infrastructure/query/ConfigQuery";
import { ConfigRepository } from "../../infrastructure/repository/ConfigRepository";
import { assert } from "../../utils/Assert";

export class CardType {
  @inject(TYPES.ConfigRepository)
  private static _configRepository: ConfigRepository;

  constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string
  ) {}

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  static async getDefaultCardTypeId(): Promise<number> {
    const configDOs = await this._configRepository.query({});
    assert(configDOs.length !== 1, "configDOs.length should be 1");
    const defaultCardTypeId = configDOs[0].defaultCardTypeId;
    assert(defaultCardTypeId !== undefined, "defaultCardTypeId is undefined.");
    return defaultCardTypeId;
  }
}
