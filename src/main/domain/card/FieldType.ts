class FieldType {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _category: "text" | "google-image"
  ) {}

  public get category(): "text" | "google-image" {
    return this._category;
  }
  public get name(): string {
    return this._name;
  }
  public get id(): number {
    return this._id;
  }
}
