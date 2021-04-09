import { TimeInterval, equals as TimeIntervalEquals } from "../time/TimeInterval";
import { haveSameEnumerableKeys } from '../../utils/ObjectUtils';

export enum Level {
  EASY = "Easy",
  GOOD = "Good",
  HARD = "Hard",
  FORGOTTEN = "Forgotten",
}

export function equals(record1: Record<Level, TimeInterval>,
                       record2: Record<Level, TimeInterval>): boolean {
  if (!haveSameEnumerableKeys(record1, record2)) {
    return false;
  }
  for (const level in record1) {
    if (!TimeIntervalEquals(record1[level as Level], record2[level as Level])) {
      return false;
    }
  }
  return true;
}