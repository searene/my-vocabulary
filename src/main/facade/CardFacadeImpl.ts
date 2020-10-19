import { ConfigQuery } from "./../infrastructure/query/ConfigQuery";
import { ConfigRepository } from "./../infrastructure/repository/ConfigRepository";
import { Card } from "./../domain/card/Card";
import { inject, injectable } from "inversify";
import { CardFacade, CardVO, FieldTypeVO, CreateCardParam } from "./CardFacade";
import { assert } from "../utils/Assert";
import { types } from "../config/types";
import { FieldType } from "../domain/card/FieldType";
import { FieldTypeRepository } from "../infrastructure/repository/FieldTypeRepository";
import { Field } from "../domain/card/Field";

@injectable()
export class CardFacadeImpl implements CardFacade {
  constructor(
    @inject(types.ConfigRepository) private _configRepository: ConfigRepository,
    @inject(types.FieldTypeRepository)
    private _fieldTypeRepository: FieldTypeRepository
  ) {}

  async getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]> {
    const fieldTypes = await FieldType.getFieldTypes(cardTypeId);
    return fieldTypes.map(fieldType => {
      return {
        id: fieldType.id,
        name: fieldType.name,
      };
    });
  }

  async createCard(createCardParam: CreateCardParam): Promise<number> {
    const card = await Card.createCard(createCardParam.bookId);
    return card.id;
  }
}
