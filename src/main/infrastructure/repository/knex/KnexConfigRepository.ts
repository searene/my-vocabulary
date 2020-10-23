import { ConfigRepository } from "../ConfigRepository";
import * as KnexFactory from "./KnexFactory";
import { ConfigDO } from "../../do/ConfigDO";
import { ConfigQuery } from "../../query/ConfigQuery";
import { injectable } from "@parisholley/inversify-async";

const knex = KnexFactory.knex;

@injectable()
export class KnexConfigRepository implements ConfigRepository {
  async init(): Promise<void> {
    await this.createTableIfNotExists();
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
  batchInsert(dataObjects: ConfigDO[]): Promise<ConfigDO[]> {
    throw new Error("Method not implemented.");
  }
  batchQueryByIds(id: number[]): Promise<ConfigDO[]> {
    throw new Error("Method not implemented.");
  }
  async insert(configDO: ConfigDO): Promise<ConfigDO> {
    const insertResult = await knex("config")
      .insert({
        default_card_type_id: configDO.defaultCardTypeId,
      })
      .returning("id");
    if (insertResult.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return insertResult[0];
  }

  async query(query: ConfigQuery): Promise<ConfigDO[]> {
    const selectResult = await knex
      .select("id", "default_card_type_id")
      .from("config");
    return selectResult.map(data => ({
      id: data["id"],
      defaultCardTypeId: data["default_card_type_id"],
    }));
  }
}
