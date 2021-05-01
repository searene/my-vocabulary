import { CardDO } from "../do/CardDO";
import { BaseRepository } from "./BaseRepository";
import { CardQuery } from "../query/CardQuery";

export interface CardRepository extends BaseRepository<CardQuery, CardDO> {

  getTodayAddedCardCount(bookId: number): Promise<number>;
}
