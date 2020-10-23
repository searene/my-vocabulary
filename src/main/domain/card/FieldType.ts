import { FieldTypeCategory } from "../../infrastructure/common/FieldTypeCategory";

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
