import { container } from "../../config/inversify.config";
import { TYPES } from "../../config/types";
import { FieldDO } from "../../infrastructure/do/FieldDO";
import { FieldRepository } from "../../infrastructure/repository/FieldRepository";

export class Field {
  private static _fieldRepository: FieldRepository = container.get(
    TYPES.FieldRepository
  );

  constructor(
    private readonly _id: number,
    private readonly _contents: string,
    private readonly _fieldTypeId: number
  ) {}

  static async batchCreate(
    fieldContents: Record<number, string>
  ): Promise<Field[]> {
    const fieldDOs: FieldDO[] = [];
    for (let [fieldTypeId, contents] of Object.entries(fieldContents)) {
      fieldDOs.push({
        fieldTypeId: parseInt(fieldTypeId),
        contents,
      });
    }
    const insertedFieldDOs = await this._fieldRepository.batchInsert(fieldDOs);
    return insertedFieldDOs.map(fieldDO => this.fromFieldDO(fieldDO));
  }

  static async getByCardId(cardId: number): Promise<Field[]> {
    const fieldDOs = await this._fieldRepository.query({ cardId });
    return fieldDOs.map(fieldDO => this.fromFieldDO(fieldDO));
  }

  static fromFieldDO(fieldDO: FieldDO): Field {
    return new Field(
      fieldDO.id as number,
      fieldDO.contents as string,
      fieldDO.fieldTypeId as number
    );
  }

  public get fieldTypeId(): number {
    return this._fieldTypeId;
  }
  public get contents(): string {
    return this._contents;
  }
  public get id(): number {
    return this._id;
  }
}
