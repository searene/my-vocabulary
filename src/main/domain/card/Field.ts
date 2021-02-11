import { FieldType } from "./FieldType";
import { FieldDO } from "../../infrastructure/do/FieldDO";
import { types } from "../../config/types";
import { FieldRepository } from "../../infrastructure/repository/FieldRepository";
import { container } from "../../config/inversify.config";
import { FieldTypeRepository } from "../../infrastructure/repository/FieldTypeRepository";

export class Field {
  constructor(
    private readonly _id: number,
    private readonly _contents: string,
    private readonly _fieldType: FieldType,
    private readonly _cardId: number
  ) {}

  public get fieldType(): FieldType {
    return this._fieldType;
  }
  public get contents(): string {
    return this._contents;
  }
  public get id(): number {
    return this._id;
  }
  public get cardId(): number {
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
      fieldDO.contents as string,
      fieldType,
      fieldDO.cardId as number
    );
  }
}
