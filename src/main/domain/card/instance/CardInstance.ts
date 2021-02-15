import { CardInstanceDO } from "../../../infrastructure/do/CardInstanceDO";
import { Composition } from "../Composition";
import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CompositionRepository } from "../../../infrastructure/repository/CompositionRepository";
import { CardRepository } from "../../../infrastructure/repository/CardRepository";
import { Card } from "../Card";
import { FieldRepository } from "../../../infrastructure/repository/FieldRepository";
import { Field } from "../Field";

export class CardInstance {
  constructor(
    private readonly _id: number,
    private readonly _composition: Composition,
    private readonly _card: Card,
    private readonly _dueTime: Date,
    private readonly _book_id: number
  ) {}

  get id(): number {
    return this._id;
  }

  get composition(): Composition {
    return this._composition;
  }

  get card(): Card {
    return this._card;
  }

  get dueTime(): Date {
    return this._dueTime;
  }

  get book_id(): number {
    return this._book_id;
  }

  static async fromCardInstanceDO(
    cardInstanceDO: CardInstanceDO
  ): Promise<CardInstance> {
    const compositionRepo = await container.getAsync<CompositionRepository>(
      types.CompositionRepository
    );
    const compositionDO = await compositionRepo.queryByIdOrThrow(
      cardInstanceDO.compositionId as number
    );
    const cardRepo = await container.getAsync<CardRepository>(
      types.CardRepository
    );
    const cardDO = await cardRepo.queryByIdOrThrow(
      cardInstanceDO.cardId as number
    );
    const composition = await Composition.fromCompositionDO(compositionDO);
    const card = await Card.fromCardDO(cardDO);
    return new CardInstance(
      cardInstanceDO.id as number,
      composition,
      card,
      cardInstanceDO.dueTime as Date,
      cardInstanceDO.bookId as number
    );
  }

  /**
   * @returns an array, which is guaranteed to have two elements,
   *          the first is the front contents, the second is the back contents
   */
  async getFrontAndBackContents(): Promise<string[]> {
    const fieldRepo = await container.getAsync<FieldRepository>(
      types.FieldRepository
    );
    const fieldDOs = await fieldRepo.query({ cardId: this._card.id });
    const fields = await Promise.all(
      fieldDOs.map(async (fieldDO) => Field.fromFieldDO(fieldDO))
    );
    const frontFieldTypeIds = this._composition.frontFieldTypes.map(
      (fieldType) => fieldType.id
    );
    const backFieldTypeIds = this._composition.backFieldTypes.map(
      (fieldType) => fieldType.id
    );
    const frontFields = fields.filter(
      (field) => frontFieldTypeIds.indexOf(field.fieldType.id) > -1
    );
    const backFields = fields.filter(
      (field) => backFieldTypeIds.indexOf(field.fieldType.id) > -1
    );
    return [
      frontFields.map((frontField) => frontField.contents).join("<br/>"),
      backFields.map((backField) => backField.contents).join("<br/>"),
    ];
  }
}
