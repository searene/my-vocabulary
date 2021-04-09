import { Scheduler } from "./Scheduler";
import { CardInstance } from "../card/instance/CardInstance";
import { Review } from "../review/Review";
import { ReviewFactory } from "../review/ReviewFactory";
import { ofDays, ofMinutes, TimeInterval } from "../time/TimeInterval";
import { TimeUnit } from "../time/TimeUnit";
import { injectable } from "@parisholley/inversify-async";
import { Level } from "../card/Level";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { ReviewRepository } from "../../infrastructure/repository/ReviewRepository";

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
        [Level.FORGOTTEN]: this.getNextTimeInterval(Level.FORGOTTEN, lastReview),
        [Level.HARD]: this.getNextTimeInterval(Level.HARD, lastReview),
        [Level.GOOD]: this.getNextTimeInterval(Level.GOOD, lastReview),
        [Level.EASY]: this.getNextTimeInterval(Level.EASY, lastReview),
      };
    }
  }

  private getNextTimeInterval(
    level: Level,
    lastReview: Review,
  ): TimeInterval {
    if (level === Level.FORGOTTEN) {
      return ofMinutes(10);
    }
    if (lastReview.level === Level.FORGOTTEN) {
      return this.getInitialReviewTimeMap()[level];
    }
    const lastTimeInterval = lastReview.timeInterval as TimeInterval;
    if (lastTimeInterval.timeUnit !== TimeUnit.DAYS) {
      throw new Error("Unsupported time unit: " + lastTimeInterval.timeUnit);
    }
    const hardIntervalInDays = Math.ceil(lastTimeInterval.value * lastReview.easinessFactor);
    if (level === Level.HARD) {
      return ofDays(hardIntervalInDays);
    } else if (level === Level.GOOD) {
      return ofDays(Math.ceil(hardIntervalInDays / 3 * 4));
    } else if (level === Level.EASY) {
      return ofDays(Math.ceil(hardIntervalInDays / 3 * 5));
    } else {
      throw new Error("Unsupported level: " + level);
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

  async processAfterAnswer(cardInstanceId: number, level: Level): Promise<void> {
    if (level === Level.FORGOTTEN) {
      return;
    }
    const reviewArray: Review[] = await ReviewFactory.queryByCardInstanceId(cardInstanceId);
    const lastReview = reviewArray[reviewArray.length - 1];
    const reviewRepo = await container.getAsync<ReviewRepository>(types.ReviewRepository);
    if (reviewArray.length == 1) {
      const initialEasinessFactor = 1.5;
      await reviewRepo.updateById({
        id: lastReview.id,
        easinessFactor: initialEasinessFactor,
      });
    } else {
      await reviewRepo.updateById({
        id: lastReview.id,
        easinessFactor: this.calculateNextEasinessFactor(lastReview.easinessFactor as number, level),
      });
    }
  }

  private calculateNextEasinessFactor(previousEasinessFactor: number, currentLevel: Level): number {
    const grade = this.getGrade(currentLevel);
    const nextEasinessFactor = previousEasinessFactor + (0.5 - (3 - grade) * (0.2 + (3 - grade) * 0.1));
    return nextEasinessFactor < 1.3 ? 1.3 : nextEasinessFactor;
  }

  private getGrade(level: Level): number {
    if (level === Level.FORGOTTEN) {
      return 0;
    } else if (level === Level.HARD) {
      return 1;
    } else if (level === Level.GOOD) {
      return 2;
    } else if (level === Level.EASY) {
      return 3;
    } else {
      throw new Error("Unsupported Level: " + level);
    }
  }
}
