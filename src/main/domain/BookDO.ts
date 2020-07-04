import { BookStatus } from "../enum/BookStatus";
import { BaseDO } from "./BaseDO";

export type BookDO = BaseDO & {
  name: string,
  contents: string,
  status: BookStatus
}