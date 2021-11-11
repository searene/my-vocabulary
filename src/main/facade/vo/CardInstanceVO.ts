import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { CardInstance } from "../../domain/card/instance/CardInstance";
import { Level } from "../../domain/card/Level";
import { Scheduler } from "../../domain/scheduler/Scheduler";
import { TimeInterval } from "../../domain/time/TimeInterval";

export type CardInstanceVO = {

  word: string;

  /**
   * cardInstance id
   */
  id: number;

  front: string;

  back: string;

  bookId: number;

  reviewTimeRecord: Record<Level, TimeInterval>;
};

export const fromCardInstance = async (cardInstance: CardInstance): Promise<CardInstanceVO> => {
    const scheduler = container.get<Scheduler>(types.Scheduler);
    const reviewTimeRecord = await scheduler.getNextReviewTimeRecord(cardInstance);
    const contents = await cardInstance.getFrontAndBackContents();
    return {
      word: cardInstance.card.word,
      id: cardInstance.id,
      front: contents[0],
      back: contents[1],
      bookId: cardInstance.bookId,
      reviewTimeRecord: reviewTimeRecord,
    };
}