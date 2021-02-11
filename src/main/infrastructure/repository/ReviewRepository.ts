import { BaseRepository } from "./BaseRepository";
import { ReviewQuery } from "../query/ReviewQuery";
import { ReviewDO } from "../do/ReviewDO";

export interface ReviewRepository
  extends BaseRepository<ReviewQuery, ReviewDO> {}
