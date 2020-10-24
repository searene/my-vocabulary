import { injectable } from "@parisholley/inversify-async";
import { CardFacade, FieldTypeVO, CreateCardParam } from "./CardFacade";
import { CardFactory } from "../domain/card/factory/CardFactory";
import { FieldTypeFactory } from "../domain/card/factory/FieldTypeFactory";

@injectable()
export class CardFacadeImpl implements CardFacade {
  private cardFactory = new CardFactory();
  private _fieldTypeFactory = FieldTypeFactory.get();

  async getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]> {
    console.log("beforeGetFieldTypes");
    const fieldTypes = await this._fieldTypeFactory.getFieldTypes(cardTypeId);
    console.log("afterGetFieldTypes");
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
