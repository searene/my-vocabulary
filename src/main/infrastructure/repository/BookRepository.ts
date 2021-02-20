import { BaseRepository } from "./BaseRepository";
import { BookQuery } from "../query/BookQuery";
import { BookDO } from "../do/BookDO";

export interface BookRepository
  extends BaseRepository<BookQuery, BookDO> {
}
