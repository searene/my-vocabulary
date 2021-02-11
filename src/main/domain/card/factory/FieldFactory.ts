import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { FieldDO } from "../../../infrastructure/do/FieldDO";
import { FieldRepository } from "../../../infrastructure/repository/FieldRepository";
import { Field } from "../Field";

export class FieldFactory {
  private static _instance: FieldFactory | undefined;

  private constructor() {}

  async createField(
    fieldTypeId: number,
    cardId: number,
    contents: string
  ): Promise<Field> {
    const fieldRepository = await this.getFieldRepository();
    const fieldDO = await fieldRepository.insert({
      fieldTypeId,
      cardId,
      contents,
    });
    return await Field.fromFieldDO(fieldDO);
  }

  async getByCardId(cardId: number): Promise<Field[]> {
    const fieldRepository = await this.getFieldRepository();
    const fieldDOs = await fieldRepository.query({ cardId });
    return Promise.all(
      fieldDOs.map(async (fieldDO) => await Field.fromFieldDO(fieldDO))
    );
  }

  async batchCreate(
    cardId: number,
    fieldContents: Record<number, string>
  ): Promise<Field[]> {
    const fieldDOs: FieldDO[] = [];
    for (let [fieldTypeId, contents] of Object.entries(fieldContents)) {
      fieldDOs.push({
        cardId: cardId,
        fieldTypeId: parseInt(fieldTypeId),
        contents,
      });
    }
    const fieldRepository = await this.getFieldRepository();
    const insertedFieldDOs = await fieldRepository.batchInsert(fieldDOs);
    return Promise.all(
      insertedFieldDOs.map(async (fieldDO) => await Field.fromFieldDO(fieldDO))
    );
  }

  private async getFieldRepository(): Promise<FieldRepository> {
    return await container.getAsync(types.FieldRepository);
  }

  static get(): FieldFactory {
    if (this._instance === undefined) {
      this._instance = new FieldFactory();
    }
    return this._instance;
  }
}
