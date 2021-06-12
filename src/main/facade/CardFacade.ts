import { FieldContents } from "../domain/card/FieldContents";
import { FieldVO } from "./vo/FieldVO";
import { Level } from "../domain/card/Level";
import { TimeInterval } from "../domain/time/TimeInterval";
import { CardInstanceVO } from "./vo/CardInstanceVO";

export type SaveCardParam = {
  word: string;

  bookId: number;

  /**
   * The cardType to be used, if no cardType was given, the default cardType would be used.
   */
  cardTypeId?: number;

  fieldContents: Record<number, FieldContents>; // fieldTypeId -> fieldContents
};
export type FieldTypeVO = {
  /**
   * fieldTypeId
   */
  id: number;
  category: string;
  name: string;
};

export type ReviewRequest = {
  cardInstanceId: number;
  level: Level;
  timeInterval: TimeInterval;
};

export type ReviewItem = {
  cardInstanceId: number;
  firstFieldId: number;
  firstFieldContents: string;
  word: string;
  bookName: string
  dueTime: number
}

export type BrowseData = {
  reviewItems: ReviewItem[];
  totalCount: number;
};

export type BrowseDataRequest = {
  searchContents?: string;

  /**
   * Start from 0
   */
  offset: number;

  limit: number;
}

export type CardCount = {
  addedToday: number;
}

export interface CardFacade {

  /**
   * Get field types of the given cardType, if no cardType was given,
   * the default cardType would be used.
   */
  getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]>;

  /**
   * Add a card to database.
   * @returns cardId
   */
  addCard(saveCardParam: SaveCardParam): Promise<number>;

  /**
   * Edit the field contents of the card that "cardInstanceId" refers to.
   */
  editCard(cardInstanceId: number, fieldTypeIdToFieldContentsMap: Record<number, FieldContents>): Promise<void>;

  getNextReviewCardInstanceByBookId(
    bookId: number
  ): Promise<CardInstanceVO | undefined>;

  getCardInstanceById(cardInstanceId: number): Promise<CardInstanceVO>;

  /**
   * Run a review on a card instance
   */
  review(reviewRequest: ReviewRequest): Promise<void>;

  getBrowseData(browseDataRequest: BrowseDataRequest): Promise<BrowseData>;

  getFieldTypeIdToFieldVOMap(cardInstanceId: number): Promise<Record<number, FieldVO>>;
}
