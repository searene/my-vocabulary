import { BaseDO } from "./BaseDO";

export type BookType = "normal" | "import";

export type BookDO = BaseDO & {
  name?: string;
  contents?: string;
  type?: BookType;
};
