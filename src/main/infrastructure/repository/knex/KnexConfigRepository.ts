import { ConfigRepository } from "../ConfigRepository";
import { knex } from "./KnexFactory";
import { ConfigDO } from "../../do/config/ConfigDO";
import { ConfigQuery } from "../../query/ConfigQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";
import { assert } from "../../../utils/Assert";
import { ConfigContents } from "../../do/config/ConfigContents";

@injectable()
export class KnexConfigRepository implements ConfigRepository {

  private static readonly _CONFIGS = "configs";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }

  async getConfig(): Promise<ConfigDO | undefined> {
    const configs = await this.query({});
    assert(
      configs.length <= 1,
      "configs.length should be less than or equal to 1."
    );
    return configs.length === 1 ? configs[0] : undefined;
  }

  async setDefaultCardTypeId(defaultCardTypeId: number): Promise<void> {
    await this.upsertByConfigContents({ defaultCardTypeId });
  }

  async getDefaultCardTypeId(): Promise<number | undefined> {
    const configs = await this.query({});
    return configs.length === 0 ? undefined : JSON.parse(configs[0].configs).defaultCardTypeId;
  }

  async updateById(configDO: ConfigDO): Promise<void> {
    await RepositoryUtils.updateById(KnexConfigRepository._CONFIGS, configDO);
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("configs");
    if (!tablesExists) {
      await knex.schema.createTable("configs", (table) => {
        table.increments();
        table.text("configs");
      });
    }
  }
  async batchInsert(configDOs: ConfigDO[]): Promise<ConfigDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(ids: number[]): Promise<ConfigDO[]> {
    return await RepositoryUtils.batchQueryByIds(
      KnexConfigRepository._CONFIGS,
      ids
    );
  }
  async insert(configDO: ConfigDO): Promise<ConfigDO> {
    return await RepositoryUtils.insert(
      KnexConfigRepository._CONFIGS,
      configDO
    );
  }

  async query(query: ConfigQuery, options?: Options): Promise<ConfigDO[]> {
    return await RepositoryUtils.query(
      KnexConfigRepository._CONFIGS,
      query,
      options
    );
  }

  async queryById(id: number): Promise<ConfigDO | undefined> {
    return await RepositoryUtils.queryById(KnexConfigRepository._CONFIGS, id);
  }

  async queryByIdOrThrow(id: number): Promise<ConfigDO> {
    return await RepositoryUtils.queryByIdOrThrow(
      KnexConfigRepository._CONFIGS,
      id
    );
  }

  async queryOne(query: ConfigQuery): Promise<ConfigDO | undefined> {
    return await RepositoryUtils.queryOne(
      KnexConfigRepository._CONFIGS,
      query);
  }

  async deleteById(id: number): Promise<void> {
    await RepositoryUtils.deleteById(
      KnexConfigRepository._CONFIGS,
      id
    );
  }
  async delete(query: ConfigQuery): Promise<number> {
    return await RepositoryUtils.delete(
      KnexConfigRepository._CONFIGS,
      query
    );
  }

  async queryCount(query: ConfigQuery): Promise<number> {
    return await RepositoryUtils.queryCount(
      KnexConfigRepository._CONFIGS,
      query
    );
  }

  async updateTheOnlyConfig(configDO: ConfigDO): Promise<void> {
    const originalConfigDO = await this.queryOneOrThrowError();
    const updateConfigDO = { id: originalConfigDO!.id, ...configDO };
    await this.updateById(updateConfigDO);
  }

  async queryOneOrThrowError(): Promise<ConfigDO> {
    const result = await this.queryOne({});
    if (result === undefined) {
      throw new Error("Config is not available.");
    }
    return result;
  }

  async upsert(configDO: ConfigDO): Promise<ConfigDO> {
    return await this.upsertByConfigContents(JSON.parse(configDO.configs as string));
  }

  async upsertByConfigContents(configContents: ConfigContents): Promise<ConfigDO> {
    const originalConfigContents = await this.queryConfigContents();
    if (originalConfigContents === undefined) {
      // Insert
      const configs = JSON.stringify({ ...configContents });
      return await this.insert({ configs });
    }
    // Update
    const newConfigs = JSON.stringify({
      ...originalConfigContents,
      ...configContents,
    });
    const newConfigDO = { configs: newConfigs };
    await this.updateTheOnlyConfig(newConfigDO);
    return newConfigDO;
  }

  async queryConfigContents(): Promise<ConfigContents | undefined> {
    const configDO = await this.queryOne({});
    if (configDO === undefined) {
      return undefined;
    }
    return { ...JSON.parse(configDO.configs) };
  }

}
