import { BaseDO } from "./BaseDO";

export type BookDO = BaseDO & {
  name?: string;
  contents?: string;
};
