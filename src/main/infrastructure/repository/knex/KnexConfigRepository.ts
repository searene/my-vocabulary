import { ConfigRepository } from "../ConfigRepository";
import { knex } from "./KnexFactory";
import { ConfigDO } from "../../do/ConfigDO";
import { ConfigQuery } from "../../query/ConfigQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";
import { assert } from "../../../utils/Assert";
import { CardInstanceDO } from "../../do/CardInstanceDO";
import { CardDO } from "../../do/CardDO";
import { CompositionQuery } from "../../query/CompositionQuery";
import { CompositionDO } from "../../do/CompositionDO";
import { CardQuery } from "../../query/CardQuery";

@injectable()
export class KnexConfigRepository implements ConfigRepository {
  private static readonly _CONFIGS = "configs";

  async getConfig(): Promise<ConfigDO | undefined> {
    const configs = await this.query({});
    assert(
      configs.length <= 1,
      "configs.length should be less than or equal to 1."
    );
    return configs.length === 1 ? configs[0] : undefined;
  }

  async setDefaultCardTypeId(defaultCardTypeId: number): Promise<void> {
    const config = await this.getConfig();
    if (config === undefined) {
      await this.insert({ defaultCardTypeId });
      return;
    }
    await this.updateById({
      id: config.id,
      defaultCardTypeId,
    });
  }

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }

  async getDefaultCardTypeId(): Promise<number | undefined> {
    const configs = await this.query({});
    return configs.length === 0 ? undefined : configs[0].defaultCardTypeId;
  }

  async updateById(configDO: ConfigDO): Promise<void> {
    await RepositoryUtils.updateById(KnexConfigRepository._CONFIGS, configDO);
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("configs");
    if (!tablesExists) {
      await knex.schema.createTable("configs", (table) => {
        table.increments();
        table.integer("default_card_type_id");
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

  async queryById(id: number): Promise<CardInstanceDO | undefined> {
    return await RepositoryUtils.queryById(KnexConfigRepository._CONFIGS, id);
  }

  async queryByIdOrThrow(id: number): Promise<CardDO> {
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

}
