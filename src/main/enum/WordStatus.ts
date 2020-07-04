import { WordStatusInDatabase } from "./WordStatusInDatabase";

export enum WordStatus {
  Deleted = -1,
  Unknown = 0,
  Known = 1,
  knownOrKnowOriginal = 2
}
