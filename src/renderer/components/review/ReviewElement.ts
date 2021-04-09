import { Level } from "../../../main/domain/card/Level";
import { TimeInterval } from "../../../main/domain/time/TimeInterval";
import { TimeUnit } from "../../../main/domain/time/TimeUnit";

export class ReviewElement {
  private static readonly levelToShortcutMap: Map<Level, string> = ReviewElement.getLevelToShortcutMap();

  constructor(
    private readonly _level: Level,
    private readonly _timeInterval: TimeInterval,
  ) {}

  public getShortcut(): string {
    return ReviewElement.getShortcutFromLevel(this.level);
  }

  public static buildReviewElementArray(reviewTimeRecord: Record<Level, TimeInterval>): ReviewElement[] {
    return Object.entries(reviewTimeRecord).map(([level, timeInterval]) => (
      new ReviewElement(level as Level, timeInterval)
    ));
  }

  public static getShortcutFromLevel(level: Level): string {
    if (!this.levelToShortcutMap.has(level)) {
      throw new Error("Unsupported level: " + level);
    }
    return this.levelToShortcutMap.get(level) as string;
  }

  private static getLevelToShortcutMap(): Map<Level, string> {
    const result = new Map();
    result.set(Level.FORGOTTEN, "j");
    result.set(Level.HARD, "k");
    result.set(Level.GOOD, "l");
    result.set(Level.EASY, ";");
    return result;
  }

  public get timeInterval(): TimeInterval {
    return this._timeInterval;
  }
  public get level(): Level {
    return this._level;
  }
}