import { inject } from "inversify";
import { TYPES } from "../../config/types";
import { FieldTypeCategory } from "../../infrastructure/common/FieldTypeCategory";
import { FieldTypeDO } from "../../infrastructure/do/FieldTypeDO";
import { FieldTypeRepository } from "../../infrastructure/repository/FieldTypeRepository";
import { CardType } from "./CardType";

export class FieldType {
  @inject(TYPES.FieldTypeRepository)
  private static _fieldTypeRepository: FieldTypeRepository;

  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _category: FieldTypeCategory
  ) {}

  public get category(): FieldTypeCategory {
    return this._category;
  }
  public get name(): string {
    return this._name;
  }
  public get id(): number {
    return this._id;
  }

  /**
   * @param cardTypeId if not given, the default cardType would be used.
   */
  static async getFieldTypes(cardTypeId?: number): Promise<FieldType[]> {
    if (cardTypeId === undefined) {
      cardTypeId = await CardType.getDefaultCardTypeId();
    }
    const fieldTypeDOs = await this._fieldTypeRepository.query({
      cardTypeId,
    });
    return fieldTypeDOs.map(fieldTypeDO =>
      FieldType.fromFieldTypeDO(fieldTypeDO)
    );
  }

  static fromFieldTypeDO(fieldTypeDO: FieldTypeDO): FieldType {
    return new FieldType(
      fieldTypeDO.id as number,
      fieldTypeDO.name as string,
      fieldTypeDO.category as FieldTypeCategory
    );
  }
}
