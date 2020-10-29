import { injectable } from "@parisholley/inversify-async";
import { CardFacade, FieldTypeVO, CreateCardParam } from "./CardFacade";
import { CardFactory } from "../domain/card/factory/CardFactory";
import { FieldTypeFactory } from "../domain/card/factory/FieldTypeFactory";
import { FieldFactory } from "../domain/card/factory/FieldFactory";

@injectable()
export class CardFacadeImpl implements CardFacade {
  private _cardFactory = new CardFactory();
  private _fieldTypeFactory = FieldTypeFactory.get();
  private _fieldFactory = FieldFactory.get();

  async getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]> {
    const fieldTypes = await this._fieldTypeFactory.getFieldTypes(cardTypeId);
    return fieldTypes.map((fieldType) => {
      return {
        id: fieldType.id,
        name: fieldType.name,
      };
    });
  }

  async createCard(createCardParam: CreateCardParam): Promise<number> {
    const card = await this._cardFactory.createCard(createCardParam.bookId);
    await this._fieldFactory.batchCreate(
      card.id,
      createCardParam.fieldContents
    );
    return card.id;
  }
}
