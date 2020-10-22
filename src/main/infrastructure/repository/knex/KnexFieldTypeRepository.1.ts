import { injectable } from "inversify";
import { FieldTypeDO } from "../../do/FieldTypeDO";
import { FieldTypeQuery } from "../../query/FieldTypeQuery";
import { FieldTypeRepository } from "../FieldTypeRepository";

@injectable()
export class KnexFieldTypeRepository implements FieldTypeRepository {
  updateById(id: number, dataObject: FieldTypeDO): Promise<FieldTypeDO> {
    throw new Error("Method not implemented.");
  }
  createTableIfNotExists(): Promise<void> {
    throw new Error("Method not implemented.");
  }
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
