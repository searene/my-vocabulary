import { isNullOrUndefined } from "./ObjectUtils"

export const isBlank = (s: string): boolean => {
  return isNullOrUndefined(s) || s.trim() === "";
}