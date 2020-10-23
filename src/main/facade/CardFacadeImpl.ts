import { injectable } from "@parisholley/inversify-async";
import { CardFacade, FieldTypeVO, CreateCardParam } from "./CardFacade";
import { FieldType } from "../domain/card/FieldType";
import { CardFactory } from "../domain/card/factory/CardFactory";
import { FieldTypeFactory } from "../domain/card/factory/FieldTypeFactory";

@injectable()
export class CardFacadeImpl implements CardFacade {
  private cardFactory = new CardFactory();
  private _fieldTypeFactory = FieldTypeFactory.get();

  constructor() {}

  async getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]> {
    const fieldTypes = await this._fieldTypeFactory.getFieldTypes(cardTypeId);
    return fieldTypes.map(fieldType => {
      return {
        id: fieldType.id,
        name: fieldType.name,
      };
    });
  }

  async createCard(createCardParam: CreateCardParam): Promise<number> {
    const card = await this.cardFactory.createCard(createCardParam.bookId);
    return card.id;
  }
}
