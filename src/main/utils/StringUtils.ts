import { isNullOrUndefined } from "./ObjectUtils";

export class StringUtils {
  static trimEndingLineSeparatorIfExists(str: string): string {
    if (str.endsWith("\n")) {
      return str.substr(0, str.length - 1);
    } else {
      return str;
    }
  }

  static isBlank(s: string): boolean {
    return isNullOrUndefined(s) || s.trim() === "";
  }
}