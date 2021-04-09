import { BaseRepository } from "./BaseRepository";
import { ConfigQuery } from "../query/ConfigQuery";
import { ConfigDO } from "../do/ConfigDO";

export interface ConfigRepository
  extends BaseRepository<ConfigQuery, ConfigDO> {
  getDefaultCardTypeId(): Promise<number | undefined>;

  setDefaultCardTypeId(defaultCardTypeId: number): Promise<void>;

  getConfig(): Promise<ConfigDO | undefined>;

  /**
   * Update the config in the table.
   * @param configDO config that needs to be updated to. configDO.id is not required.
   */
  updateTheOnlyConfig(configDO: ConfigDO): Promise<void>;

  queryOneOrThrowError(): Promise<ConfigDO>;
}
