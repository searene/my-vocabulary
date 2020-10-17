import { Card } from "./../domain/card/Card";
import { injectable } from "inversify";
import { CardFacade, CardVO, SaveCardParam } from "./CardFacade";

@injectable()
export class CardFacadeImpl implements CardFacade {
  async createCard(bookId: number): Promise<CardVO> {
    const card = await Card.createEmptyCard(bookId);
    return this.toCardVO(card);
  }

  async saveCard(saveCardParam: SaveCardParam): Promise<number> {
    const card = await Card.createEmptyCard(saveCardParam.bookId);
    for (const field of card.fields) {
      field.contents = saveCardParam.fieldContents[field.fieldType.id];
    }
    const savedCard = await card.save();
    if (savedCard.id === undefined) {
      throw new Error("savedCard.id is undefined.");
    }
    return savedCard.id;
  }

  private toCardVO(card: Card): CardVO {
    return {
      cardTypeVO: {
        id: card.cardType.id,
        name: card.cardType.name,
      },
      fieldVOs: card.fields.map(field => {
        return {
          fieldTypeId: field.fieldType.id,
          fieldName: field.fieldType.name,
        };
      }),
    };
  }
}
