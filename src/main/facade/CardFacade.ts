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
export type SaveCardParam = {
  bookId: number;
  cardTypeId: number;
  fieldContents: Record<number, string>; // fieldTypeId -> fieldContents
};
export interface CardFacade {
  createCard(bookId: number): Promise<CardVO>;

  /**
   * Save the card to database
   * @returns cardId
   */
  saveCard(saveCardParam: SaveCardParam): Promise<number>;
}