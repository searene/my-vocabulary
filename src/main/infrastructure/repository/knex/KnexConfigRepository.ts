import { ConfigRepository } from "../ConfigRepository";
import { knex } from "./KnexFactory";
import { ConfigDO } from "../../do/ConfigDO";
import { ConfigQuery } from "../../query/ConfigQuery";
import { injectable } from "@parisholley/inversify-async";
import { Options } from "../../query/Options";
import { RepositoryUtils } from "../RepositoryUtils";

@injectable()
export class KnexConfigRepository implements ConfigRepository {
  private static readonly _CONFIGS = "configs";

  async init(): Promise<void> {
    await this.createTableIfNotExists();
  }

  async getDefaultCardTypeId(): Promise<number | undefined> {
    const configs = await this.query({});
    return configs.length === 0 ? undefined : configs[0].defaultCardTypeId;
  }

  async updateById(id: number, configDO: ConfigDO): Promise<ConfigDO> {
    return await knex("config")
      .where({ id })
      .update(configDO)
      .select("*");
  }
  async createTableIfNotExists(): Promise<void> {
    const tablesExists = await knex.schema.hasTable("configs");
    if (!tablesExists) {
      await knex.schema.createTable("configs", table => {
        table.increments();
        table.integer("default_card_type_id");
      });
    }
  }
  async batchInsert(configDOs: ConfigDO[]): Promise<ConfigDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(id: number[]): Promise<ConfigDO[]> {
    throw new Error("Method not implemented.");
  }
  async insert(configDO: ConfigDO): Promise<ConfigDO> {
    return RepositoryUtils.insert(KnexConfigRepository._CONFIGS, configDO);
  }

  async query(query: ConfigQuery, options?: Options): Promise<ConfigDO[]> {
    return RepositoryUtils.query(KnexConfigRepository._CONFIGS, query, options);
  }
}
