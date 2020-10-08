import { BaseRepository } from "./BaseRepository";
import { CardTypeDO } from "../do/CardTypeDO";
import { CardTypeQuery } from "../query/CardTypeQuery";

export interface CardTypeRepository
  extends BaseRepository<CardTypeQuery, CardTypeDO> {}
