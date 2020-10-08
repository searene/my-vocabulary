import { ConfigRepository } from "../ConfigRepository";
import * as KnexFactory from "./KnexFactory";
import { ConfigDO } from "../../do/ConfigDO";
import { ConfigQuery } from "../../query/ConfigQuery";

const knex = KnexFactory.knex;

export class KnexConfigRepository implements ConfigRepository {
  async insert(configDO: ConfigDO): Promise<number> {
    const insertResult = await knex("config")
      .insert({
        defaultCardTypeId: configDO.defaultCardTypeId,
      })
      .returning("id");
    if (insertResult.length !== 1) {
      throw new Error("insertResult's length should be 1");
    }
    return insertResult[0];
  }

  async query(query: ConfigQuery): Promise<ConfigDO[]> {
    const selectResult = await knex.select("defaultCardTypeId").from("config");
    return selectResult.map(data => {
      const configDO = new ConfigDO();
      configDO.defaultCardTypeId = data.get("defaultCardTypeId");
      return configDO;
    });
  }
}
