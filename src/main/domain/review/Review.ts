import { ReviewDO } from "../../infrastructure/do/ReviewDO";
import { CardInstanceRepository } from "../../infrastructure/repository/CardInstanceRepository";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { CardInstance } from "../card/instance/CardInstance";
import { CardInstanceFactory } from "../card/instance/CardInstanceFactory";
import { fromTimeIntervalStr, TimeInterval } from "../time/TimeInterval";
import { Level } from "../card/Level";

export class Review {
  constructor(
    private readonly _id: number,
    private readonly _cardInstance: CardInstance,
    private readonly _reviewTime: Date,
    private _level: Level,
    private _timeInterval: TimeInterval
  ) {}

  static async fromReviewDO(reviewDO: ReviewDO): Promise<Review> {
    const cardInstance = await CardInstanceFactory.queryById(
      reviewDO.cardInstanceId as number
    );
    if (cardInstance == undefined) {
      throw new Error(
        "cardInstance cannot be undefined, reviewId: " + reviewDO.id
      );
    }
    return new Review(
      reviewDO.id as number,
      cardInstance,
      reviewDO.reviewTime as Date,
      reviewDO.level as Level,
      fromTimeIntervalStr(reviewDO.timeInterval as string)
    );
  }

  async save(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  get id(): number {
    return this._id;
  }

  get cardInstance(): CardInstance {
    return this._cardInstance;
  }

  get reviewTime(): Date {
    return this._reviewTime;
  }

  get level(): Level {
    return this._level;
  }

  get timeInterval(): TimeInterval {
    return this._timeInterval;
  }
}
