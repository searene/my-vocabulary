export enum TimeUnit {
  MINUTES = "minutes",
  DAYS = "days",
}

export function fromTimeUnitStr(timeUnitStr: string): TimeUnit {
  if (!timeUnitStr.endsWith("s")) {
    timeUnitStr = timeUnitStr + "s";
  }
  for (const key of Object.keys(TimeUnit)) {
    if (timeUnitStr == TimeUnit[key as keyof typeof TimeUnit]) {
      return TimeUnit[key as keyof typeof TimeUnit];
    }
  }
  throw new Error("Invalid timeUnitStr: " + timeUnitStr);
}
