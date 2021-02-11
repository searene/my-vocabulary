import { CardInstance } from "../card/instance/CardInstance";
import { TimeInterval } from "../time/TimeInterval";

export interface Scheduler {
  getNextReviewTimeMap(
    cardInstance: CardInstance
  ): Promise<Map<Level, TimeInterval>>;

  getInitialReviewDate(): Date;
}
