import { FieldTypeDO } from "../do/FieldTypeDO";
import { FieldTypeQuery } from "../query/FieldTypeQuery";
import { BaseRepository } from "./BaseRepository";

export interface FieldTypeRepository
  extends BaseRepository<FieldTypeQuery, FieldTypeDO> {}
