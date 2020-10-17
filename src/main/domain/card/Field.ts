class Field {
  constructor(
    private readonly _id: number,
    private readonly _contents: string,
    private readonly _fieldType: FieldType
  ) {}

  public get fieldType(): FieldType {
    return this._fieldType;
  }
  public get contents(): string {
    return this._contents;
  }
  public get id(): number {
    return this._id;
  }
}
