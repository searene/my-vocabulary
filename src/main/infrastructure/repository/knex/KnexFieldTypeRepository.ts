import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { FieldTypeRepository } from "../FieldTypeRepository";

export class KnexFieldTypeRepository implements FieldTypeRepository {
  async insert(dataObject: FieldTypeDO): Promise<FieldTypeDO> {
    throw new Error("Method not implemented.");
  }
  async batchInsert(dataObjects: FieldTypeDO[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async query(query: FieldTypeQuery): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
  async batchQueryByIds(id: number[]): Promise<FieldTypeDO[]> {
    throw new Error("Method not implemented.");
  }
}
