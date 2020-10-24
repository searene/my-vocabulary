import { BaseRepository } from "./BaseRepository";
import { ConfigQuery } from "../query/ConfigQuery";
import { ConfigDO } from "../do/ConfigDO";

export interface ConfigRepository
  extends BaseRepository<ConfigQuery, ConfigDO> {
  getDefaultCardTypeId(): Promise<number | undefined>;

  setDefaultCardTypeId(defaultCardTypeId: number): Promise<void>;

  getConfig(): Promise<ConfigDO | undefined>;
}
