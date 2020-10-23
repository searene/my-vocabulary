import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { FieldTypeCategory } from "../../../infrastructure/common/FieldTypeCategory";
import { FieldTypeDO } from "../../../infrastructure/do/FieldTypeDO";
import { FieldTypeRepository } from "../../../infrastructure/repository/FieldTypeRepository";
import { CardType } from "../CardType";
import { FieldType } from "../FieldType";
import { CardTypeFactory } from "./CardTypeFactory";

export class FieldTypeFactory {
  private _cardTypeFactory = CardTypeFactory.get();

  private static _instance: FieldTypeFactory | undefined;

  private constructor() {}

  /**
   * @param cardTypeId if not given, the default cardType would be used.
   */
  async getFieldTypes(cardTypeId?: number): Promise<FieldType[]> {
    const fieldTypeRepository: FieldTypeRepository = await container.getAsync(
      types.FieldTypeRepository
    );
    if (cardTypeId === undefined) {
      cardTypeId = await this._cardTypeFactory.getDefaultCardTypeId();
    }
    const fieldTypeDOs = await fieldTypeRepository.query({
      cardTypeId,
    });
    return fieldTypeDOs.map(fieldTypeDO => this.fromFieldTypeDO(fieldTypeDO));
  }

  static get(): FieldTypeFactory {
    if (this._instance === undefined) {
      this._instance = new FieldTypeFactory();
    }
    return this._instance;
  }

  private fromFieldTypeDO(fieldTypeDO: FieldTypeDO): FieldType {
    return new FieldType(
      fieldTypeDO.id as number,
      fieldTypeDO.name as string,
      fieldTypeDO.category as FieldTypeCategory
    );
  }
}
