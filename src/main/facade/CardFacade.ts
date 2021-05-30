import { TimeInterval } from "../domain/time/TimeInterval";
import { Level } from "../domain/card/Level";
import { FieldContents } from "../domain/card/FieldContents";
import { FieldVO } from "./vo/FieldVO";

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

export type CardInstanceVO = {

  word: string;

  /**
   * cardInstance id
   */
  id: number;

  front: string;

  back: string;

  reviewTimeRecord: Record<Level, TimeInterval>;
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
   * Save the card to database
   * @returns cardId
   */
  saveCard(saveCardParam: SaveCardParam): Promise<number>;

  getNextReviewCardInstanceByBookId(
    bookId: number
  ): Promise<CardInstanceVO | undefined>;

  /**
   * Run a review on a card instance
   */
  review(reviewRequest: ReviewRequest): Promise<void>;

  getBrowseData(browseDataRequest: BrowseDataRequest): Promise<BrowseData>;

  getFieldTypeIdToFieldVOMap(cardInstanceId: number): Promise<Record<number, FieldVO>>;
}
