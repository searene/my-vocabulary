import { CardInstance } from "../card/instance/CardInstance";
import { TimeInterval } from "../time/TimeInterval";
import { Level } from "../card/Level";

export interface Scheduler {
  getNextReviewTimeRecord(
    cardInstance: CardInstance
  ): Promise<Record<Level, TimeInterval>>;

  getInitialReviewDate(): Date;
}
