import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { FieldTypeCategory } from "../../../infrastructure/common/FieldTypeCategory";
import { FieldTypeDO } from "../../../infrastructure/do/FieldTypeDO";
import { FieldTypeRepository } from "../../../infrastructure/repository/FieldTypeRepository";
import { FieldType } from "../../field/FieldType";
import { CardTypeFactory } from "./CardTypeFactory";

export class FieldTypeFactory {
  private _cardTypeFactory = CardTypeFactory.get();

  private static _instance: FieldTypeFactory | undefined;

  private constructor() {}

  /**
   * @param cardTypeId if not given, the default cardType would be used.
   */
  async getFieldTypes(cardTypeId?: number): Promise<FieldType[]> {
    const fieldTypeRepository = await this.getFieldTypeRepository();
    if (cardTypeId === undefined) {
      cardTypeId = (await this._cardTypeFactory.getDefaultCardType()).id;
    }
    const fieldTypeDOs = await fieldTypeRepository.query({
      cardTypeId,
    });
    return await Promise.all(
      fieldTypeDOs.map(
        async (fieldTypeDO) => await FieldType.fromFieldTypeDO(fieldTypeDO)
      )
    );
  }

  async createSimpleFieldTypes(
    initialCardTypeId: number
  ): Promise<FieldType[]> {
    const fieldTypeRepository = await this.getFieldTypeRepository();
    const fieldTypeDOs = await fieldTypeRepository.query({
      cardTypeId: initialCardTypeId,
    });
    if (fieldTypeDOs.length > 0) {
      // The initial field types already exist
      return await Promise.all(
        fieldTypeDOs.map(
          async (fieldTypeDO) => await FieldType.fromFieldTypeDO(fieldTypeDO)
        )
      );
    }
    const frontFieldDO = await fieldTypeRepository.upsert({
      name: "front",
      category: "text",
      cardTypeId: initialCardTypeId,
    });
    const backFieldDO = await fieldTypeRepository.upsert({
      name: "back",
      category: "text",
      cardTypeId: initialCardTypeId,
    });
    const frontField = await FieldType.fromFieldTypeDO(frontFieldDO);
    const backField = await FieldType.fromFieldTypeDO(backFieldDO);
    return [frontField, backField];
  }

  static get(): FieldTypeFactory {
    if (this._instance === undefined) {
      this._instance = new FieldTypeFactory();
    }
    return this._instance;
  }

  private async getFieldTypeRepository(): Promise<FieldTypeRepository> {
    return container.getAsync(types.FieldTypeRepository);
  }
}
