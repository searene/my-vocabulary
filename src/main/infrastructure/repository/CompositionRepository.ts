import { CompositionDO } from "../do/CompositionDO";
import { CompositionQuery } from "../query/CompositionQuery";
import { BaseRepository } from "./BaseRepository";

export interface CompositionRepository
  extends BaseRepository<CompositionQuery, CompositionDO> {}
