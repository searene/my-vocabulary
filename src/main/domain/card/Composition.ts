import { CardType } from "./CardType";
import { CompositionDO } from "../../infrastructure/do/CompositionDO";
import { CardTypeRepository } from "../../infrastructure/repository/CardTypeRepository";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { FieldType } from "./FieldType";
import { FieldTypeRepository } from "../../infrastructure/repository/FieldTypeRepository";

export class Composition {
  private constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _cardType: CardType,
    private readonly _frontFieldTypes: FieldType[],
    private readonly _backFieldTypes: FieldType[]
  ) {}

  public static build(
    id: number,
    name: string,
    cardType: CardType,
    frontTypes: FieldType[],
    backTypes: FieldType[]
  ) {
    return new Composition(id, name, cardType, frontTypes, backTypes);
  }

  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get cardType(): CardType {
    return this._cardType;
  }
  get backFieldTypes(): FieldType[] {
    return this._backFieldTypes;
  }
  get frontFieldTypes(): FieldType[] {
    return this._frontFieldTypes;
  }
  static async fromCompositionDO(
    compositionDO: CompositionDO
  ): Promise<Composition> {
    const cardTypeRepo = await container.getAsync<CardTypeRepository>(
      types.CardTypeRepository
    );
    const cardTypeDO = await cardTypeRepo.queryByIdOrThrow(
      compositionDO.cardTypeId as number
    );
    const fieldTypeRepo = await container.getAsync<FieldTypeRepository>(
      types.FieldTypeRepository
    );
    const frontFieldTypeIds = Composition.getFieldTypeIdsFromStr(
      compositionDO.frontTypeIds as string
    );
    const backFieldTypeIds = Composition.getFieldTypeIdsFromStr(
      compositionDO.backTypeIds as string
    );
    const fieldTypeDOs = await fieldTypeRepo.batchQueryByIds(
      frontFieldTypeIds.concat(backFieldTypeIds)
    );
    const fieldTypes = await Promise.all(
      fieldTypeDOs.map(
        async (fieldTypeDO) => await FieldType.fromFieldTypeDO(fieldTypeDO)
      )
    );
    const frontFieldTypes = fieldTypes.filter(
      (fieldType) => frontFieldTypeIds.indexOf(fieldType.id) > -1
    );
    const backFieldTypes = fieldTypes.filter(
      (fieldType) => backFieldTypeIds.indexOf(fieldType.id) > -1
    );
    return Composition.build(
      compositionDO.id as number,
      compositionDO.name as string,
      CardType.fromCardTypeDO(cardTypeDO),
      frontFieldTypes,
      backFieldTypes
    );
  }

  private static getFieldTypeIdsFromStr(fieldTypeIdsStr: string): number[] {
    return fieldTypeIdsStr.split(",").map(id => parseInt(id));
  }
}
