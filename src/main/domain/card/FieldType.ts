import { FieldTypeCategory } from "../../infrastructure/common/FieldTypeCategory";
import { CardType } from "./CardType";
import { FieldTypeDO } from "../../infrastructure/do/FieldTypeDO";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { CardTypeRepository } from "../../infrastructure/repository/CardTypeRepository";

export class FieldType {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _cardType: CardType,
    private readonly _category: FieldTypeCategory
  ) {}

  public get id(): number {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get cardType(): CardType {
    return this._cardType;
  }
  public get category(): FieldTypeCategory {
    return this._category;
  }

  static async fromFieldTypeDO(fieldTypeDO: FieldTypeDO): Promise<FieldType> {
    const cardTypeRepo: CardTypeRepository = await container.getAsync(
      types.CardTypeRepository
    );
    const cardTypeDO = await cardTypeRepo.queryById(
      fieldTypeDO.cardTypeId as number
    );
    if (cardTypeDO == undefined) {
      throw new Error("Invalid cardType id: " + fieldTypeDO.cardTypeId);
    }
    const cardType = CardType.fromCardTypeDO(cardTypeDO);
    return new FieldType(
      fieldTypeDO.id as number,
      fieldTypeDO.name as string,
      cardType,
      fieldTypeDO.category as FieldTypeCategory
    );
  }
}
