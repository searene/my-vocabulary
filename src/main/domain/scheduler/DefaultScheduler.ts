import { Scheduler } from "./Scheduler";
import { CardInstance } from "../card/instance/CardInstance";
import { Review } from "../review/Review";
import { ReviewFactory } from "../review/ReviewFactory";
import { TimeInterval } from "../time/TimeInterval";
import { TimeUnit } from "../time/TimeUnit";
import { inject, injectable } from "@parisholley/inversify-async";

@injectable()
export class DefaultScheduler implements Scheduler {
  async getNextReviewTimeMap(
    cardInstance: CardInstance
  ): Promise<Map<Level, TimeInterval>> {
    const reviewArray: Review[] = await ReviewFactory.queryByCardInstanceId(
      cardInstance.id
    );
    const result: Map<Level, TimeInterval> = new Map();
    if (reviewArray.length == 0) {
      result.set(Level.FORGOTTEN, TimeInterval.ofMinutes(10));
      result.set(Level.HARD, TimeInterval.ofDays(1));
      result.set(Level.GOOD, TimeInterval.ofDays(2));
      result.set(Level.EASY, TimeInterval.ofDays(4));
    } else {
      const lastReview: Review = reviewArray[reviewArray.length - 1];
      result.set(Level.FORGOTTEN, TimeInterval.ofMinutes(10));
      result.set(Level.HARD, this.getNextTimeInterval(lastReview, 1.2));
      result.set(Level.GOOD, this.getNextTimeInterval(lastReview, 1.3));
      result.set(Level.EASY, this.getNextTimeInterval(lastReview, 1.4));
    }
    return result;
  }

  private getNextTimeInterval(
    lastReview: Review,
    factor: number
  ): TimeInterval {
    if (lastReview.timeInterval.timeUnit == TimeUnit.MINUTES) {
      return TimeInterval.ofDays(1);
    } else if (lastReview.timeInterval.timeUnit == TimeUnit.DAYS) {
      return TimeInterval.ofDays(
        Math.ceil(lastReview.timeInterval.value * factor)
      );
    } else {
      throw new Error("Unsupported timeUnit: " + lastReview.timeInterval);
    }
  }
}
