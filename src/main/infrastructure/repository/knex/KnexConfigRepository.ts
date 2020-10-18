import { ConfigRepository } from "../ConfigRepository";
import * as KnexFactory from "./KnexFactory";
import { ConfigDO } from "../../do/ConfigDO";
import { ConfigQuery } from "../../query/ConfigQuery";
import { injectable } from "inversify";

const knex = KnexFactory.knex;

@injectable()
export class KnexConfigRepository implements ConfigRepository {
  batchInsert(dataObjects: ConfigDO[]): Promise<number[]> {
    throw new Error("Method not implemented.");
  }
  batchQueryByIds(id: number[]): Promise<ConfigDO[]> {
    throw new Error("Method not implemented.");
  }
  async insert(configDO: ConfigDO): Promise<number> {
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
    return selectResult.map(data => {
      const configDO = new ConfigDO();
      configDO.defaultCardTypeId = data.get("default_card_type_id");
      return configDO;
    });
  }
}
