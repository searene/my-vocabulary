import { fromTimeUnitStr, TimeUnit } from "./TimeUnit";

export type TimeInterval = {
  timeUnit: TimeUnit;
  value: number;
};

export function ofMinutes(minutes: number): TimeInterval {
  return {
    timeUnit: TimeUnit.MINUTES,
    value: minutes,
  };
}

export function ofDays(days: number): TimeInterval {
  return {
    timeUnit: TimeUnit.DAYS,
    value: days,
  };
}

export function now(): TimeInterval {
  return {
    timeUnit: TimeUnit.MINUTES,
    value: 0,
  };
}

export function equals(timeInterval1: TimeInterval, timeInterval2: TimeInterval): boolean {
  return timeInterval1.timeUnit === timeInterval2.timeUnit
      && timeInterval1.value === timeInterval2.value;
}

/**
 * @param timeIntervalStr example: 10 min, 1 day, etc.
 */
export function fromTimeIntervalStr(timeIntervalStr: string): TimeInterval {
  const timeIntervalSplit = timeIntervalStr.split(/\s/);
  if (timeIntervalSplit.length != 2) {
    throw new Error(
      "timeIntervalSplit.length is not 2, actual value: " +
        timeIntervalSplit.length
    );
  }
  const timeUnit = fromTimeUnitStr(timeIntervalSplit[1]);
  return {
    timeUnit,
    value: parseInt(timeIntervalSplit[0]),
  };
}

export function convertTimeIntervalToString(
  timeInterval: TimeInterval
): string {
  if (timeInterval.value == 1) {
    return `${timeInterval.value} ${timeInterval.timeUnit.substr(
      0,
      timeInterval.timeUnit.length - 1
    )}`;
  } else {
    return `${timeInterval.value} ${timeInterval.timeUnit}`;
  }
}

export function addTimeInterval(
  fromDate: Date,
  timeInterval: TimeInterval
): Date {
  const result = new Date(fromDate);
  if (timeInterval.timeUnit == TimeUnit.MINUTES) {
    result.setMinutes(result.getMinutes() + timeInterval.value);
  } else if (timeInterval.timeUnit == TimeUnit.DAYS) {
    result.setDate(result.getDate() + timeInterval.value);
  } else {
    throw new Error("Unsupported timeUnit: " + timeInterval.timeUnit);
  }
  return result;
}
