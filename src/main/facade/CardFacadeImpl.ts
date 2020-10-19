import { Card } from "./../domain/card/Card";
import { injectable } from "inversify";
import { CardFacade, FieldTypeVO, CreateCardParam } from "./CardFacade";
import { FieldType } from "../domain/card/FieldType";

@injectable()
export class CardFacadeImpl implements CardFacade {
  constructor() {}

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
