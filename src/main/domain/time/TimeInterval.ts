import { fromTimeUnitStr, TimeUnit } from "./TimeUnit";

export class TimeInterval {
  constructor(private _timeUnit: TimeUnit, private _value: number) {}

  static ofMinutes(minutes: number): TimeInterval {
    return new TimeInterval(TimeUnit.MINUTES, minutes);
  }

  static ofDays(days: number): TimeInterval {
    return new TimeInterval(TimeUnit.DAYS, days);
  }

  static now(): TimeInterval {
    return TimeInterval.ofMinutes(0);
  }

  /**
   * @param timeIntervalStr example: 10 min, 1 day, etc.
   */
  static fromTimeIntervalStr(timeIntervalStr: string): TimeInterval {
    const timeIntervalSplit = timeIntervalStr.split("s");
    if (timeIntervalSplit.length != 2) {
      throw new Error(
        "timeIntervalSplit.length is not 2, actual value: " +
          timeIntervalSplit.length
      );
    }
    const timeUnit = fromTimeUnitStr(timeIntervalSplit[1]);
    return new TimeInterval(timeUnit, parseInt(timeIntervalSplit[0]));
  }

  get timeUnit(): TimeUnit {
    return this._timeUnit;
  }

  get value(): number {
    return this._value;
  }
}
