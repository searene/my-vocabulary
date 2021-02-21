import { FieldDO } from "../do/FieldDO";
import { FieldQuery } from "../query/FieldQuery";
import { BaseRepository } from "./BaseRepository";

export interface FieldRepository extends BaseRepository<FieldQuery, FieldDO> {

  batchQueryByCardIds(cardIds: number[]): Promise<FieldDO[]>;
}
