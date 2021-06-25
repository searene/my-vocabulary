import { BaseRepository } from "./BaseRepository";
import { ConfigQuery } from "../query/ConfigQuery";
import { ConfigDO } from "../do/config/ConfigDO";
import { ConfigContents } from "../do/config/ConfigContents";

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

  setOnlyCountOriginalWords(onlyCountOriginalWords: boolean): Promise<void>;

  onlyCountOriginalWords(): Promise<boolean | undefined>;

  upsertByConfigContents(configContents: ConfigContents): Promise<ConfigDO>;

  queryConfigContents(): Promise<ConfigContents | undefined>;
}
