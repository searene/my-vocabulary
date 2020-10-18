import { FieldTypeDO } from "../do/FieldTypeDO";
import { BaseRepository } from "./BaseRepository";

export interface FieldTypeRepository
  extends BaseRepository<FieldTypeQuery, FieldTypeDO> {}
