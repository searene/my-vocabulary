import { Scheduler } from "./Scheduler";
import { CardInstance } from "../card/instance/CardInstance";
import { Review } from "../review/Review";
import { ReviewFactory } from "../review/ReviewFactory";
import { ofDays, ofMinutes, TimeInterval } from "../time/TimeInterval";
import { TimeUnit } from "../time/TimeUnit";
import { injectable } from "@parisholley/inversify-async";
import { Level } from "../card/Level";

@injectable()
export class DefaultScheduler implements Scheduler {
  async getNextReviewTimeRecord(
    cardInstance: CardInstance
  ): Promise<Record<Level, TimeInterval>> {
    const reviewArray: Review[] = await ReviewFactory.queryByCardInstanceId(
      cardInstance.id
    );
    if (reviewArray.length == 0) {
      return this.getInitialReviewTimeMap();
    } else {
      const lastReview: Review = reviewArray[reviewArray.length - 1];
      return {
        [Level.FORGOTTEN]: ofMinutes(10),
        [Level.HARD]: this.getNextTimeInterval(lastReview, 1.2),
        [Level.GOOD]: this.getNextTimeInterval(lastReview, 1.3),
        [Level.EASY]: this.getNextTimeInterval(lastReview, 1.4),
      };
    }
  }

  private getNextTimeInterval(
    lastReview: Review,
    factor: number
  ): TimeInterval {
    if (lastReview.timeInterval.timeUnit == TimeUnit.MINUTES) {
      return ofDays(1);
    } else if (lastReview.timeInterval.timeUnit == TimeUnit.DAYS) {
      return ofDays(Math.ceil(lastReview.timeInterval.value * factor));
    } else {
      throw new Error("Unsupported timeUnit: " + lastReview.timeInterval);
    }
  }

  getInitialReviewDate(): Date {
    return new Date();
  }

  getInitialReviewTimeMap(): Record<Level, TimeInterval> {
    return {
      [Level.FORGOTTEN]: ofMinutes(10),
      [Level.HARD]: ofDays(1),
      [Level.GOOD]: ofDays(2),
      [Level.EASY]: ofDays(4),
    };
  }
}
