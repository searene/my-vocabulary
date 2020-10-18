export type FieldVO = {
  fieldTypeId: number;
  fieldName: string;
};
export type CardTypeVO = {
  id: number;
  name: string;
};
export type CardVO = {
  cardTypeVO: CardTypeVO;
  fieldVOs: FieldVO[];
};
export type CreateCardParam = {
  bookId: number;

  /**
   * The cardType to be used, if no cardType was given, the default cardType would be used.
   */
  cardTypeId?: number;

  fieldContents: Record<number, string>; // fieldTypeId -> fieldContents
};
export type FieldTypeVO = {
  id: number;
  name: string;
};
export interface CardFacade {
  /**
   * Get field types of the given cardType, if no cardType was given,
   * the default cardType would be used.
   */
  getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]>;

  /**
   * Save the card to database
   * @returns cardId
   */
  createCard(createCardParam: CreateCardParam): Promise<number>;
}
