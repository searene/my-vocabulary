import { inject } from "inversify";
import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { FieldTypeCategory } from "../../infrastructure/common/FieldTypeCategory";
import { FieldTypeDO } from "../../infrastructure/do/FieldTypeDO";
import { FieldTypeRepository } from "../../infrastructure/repository/FieldTypeRepository";
import { CardType } from "./CardType";

export class FieldType {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _category: FieldTypeCategory
  ) {}

  public get category(): FieldTypeCategory {
    return this._category;
  }
  public get name(): string {
    return this._name;
  }
  public get id(): number {
    return this._id;
  }
}
