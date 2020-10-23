import { FieldTypeCategory } from "../../infrastructure/common/FieldTypeCategory";

export class FieldType {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _cardTypeId: number,
    private readonly _category: FieldTypeCategory
  ) {}

  public get id(): number {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get cardTypeId(): number {
    return this._cardTypeId;
  }
  public get category(): FieldTypeCategory {
    return this._category;
  }
}
