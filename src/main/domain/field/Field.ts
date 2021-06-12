import { FieldType } from "./FieldType";
import { FieldDO } from "../../infrastructure/do/FieldDO";
import { types } from "../../config/types";
import { container } from "../../config/inversify.config";
import { FieldTypeRepository } from "../../infrastructure/repository/FieldTypeRepository";
import { FieldContents } from "../card/FieldContents";
import { FieldRepository } from "../../infrastructure/repository/FieldRepository";
import { CardInstanceRepository } from "../../infrastructure/repository/CardInstanceRepository";
import { CardRepository } from "../../infrastructure/repository/CardRepository";

export class Field {
  constructor(
    private readonly _id: number,
    private readonly _originalContents: string,
    private readonly _plainTextContents: string,
    private readonly _fieldType: FieldType,
    private readonly _cardId: number
  ) {}

  updateFieldContents = async (originalContents: string, plainTextContents: string) => {
    const fieldRepo = await container.getAsync<FieldRepository>(types.FieldRepository);
    await fieldRepo.updateById({
      id: this.id,
      originalContents,
      plainTextContents
    });
  }

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

  static async fromCardId(cardId: number): Promise<Field[]> {
    const fieldRepo = await container.getAsync<FieldRepository>(types.FieldRepository);
    const fieldDOs: FieldDO[] = await fieldRepo.query({ cardId });
    return Promise.all(fieldDOs.map(async fieldDO => await this.fromFieldDO(fieldDO)));
  }

  static async fromCardInstanceId(cardInstanceId: number): Promise<Field[]> {
    const cardInstanceRepo = await container.getAsync<CardInstanceRepository>(types.CardInstanceRepository);
    const cardInstanceDOs = await cardInstanceRepo.queryById(cardInstanceId);
    const cardRepo = await container.getAsync<CardRepository>(types.CardRepository);
    const cardDO = await cardRepo.queryById(cardInstanceDOs!.cardId as number);
    return await this.fromCardId(cardDO?.id as number);
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
