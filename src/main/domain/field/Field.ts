import { FieldType } from "./FieldType";
import { FieldDO } from "../../infrastructure/do/FieldDO";
import { types } from "../../config/types";
import { container } from "../../config/inversify.config";
import { FieldTypeRepository } from "../../infrastructure/repository/FieldTypeRepository";
import { FieldContents } from "../card/FieldContents";
import { FieldRepository } from "../../infrastructure/repository/FieldRepository";

export class Field {
  constructor(
    private readonly _id: number,
    private readonly _originalContents: string,
    private readonly _plainTextContents: string,
    private readonly _fieldType: FieldType,
    private readonly _cardId: number
  ) {}

  get fieldType(): FieldType {
    return this._fieldType;
  }
  get originalContents(): string {
    return this._originalContents;
  }
  get plainTextContents(): string {
    return this._plainTextContents;
  }
  get id(): number {
    return this._id;
  }
  get cardId(): number {
    return this._cardId;
  }

  static async fromFieldDO(fieldDO: FieldDO): Promise<Field> {
    const fieldTypeRepo = await container.getAsync<FieldTypeRepository>(
      types.FieldTypeRepository
    );
    const fieldTypeDO = await fieldTypeRepo.queryByIdOrThrow(
      fieldDO.fieldTypeId as number
    );
    const fieldType = await FieldType.fromFieldTypeDO(fieldTypeDO);
    return new Field(
      fieldDO.id as number,
      fieldDO.originalContents as string,
      fieldDO.plainTextContents as string,
      fieldType,
      fieldDO.cardId as number
    );
  }

  static async batchCreate(
    cardId: number,
    fieldContents: Record<number, FieldContents>
  ): Promise<Field[]> {
    const fieldDOs: FieldDO[] = [];
    for (let [fieldTypeId, contents] of Object.entries(fieldContents)) {
      fieldDOs.push({
        cardId: cardId,
        fieldTypeId: parseInt(fieldTypeId),
        originalContents: contents.originalContents,
        plainTextContents: contents.plainTextContents,
      });
    }
    const fieldRepo = await container.getAsync<FieldRepository>(types.FieldRepository);
    const insertedFieldDOs = await fieldRepo.batchInsert(fieldDOs);
    return Promise.all(
      insertedFieldDOs.map(async (fieldDO) => await Field.fromFieldDO(fieldDO))
    );
  }
}
