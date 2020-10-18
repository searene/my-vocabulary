class Composition {
  constructor(
    private readonly _id: number,
    private readonly _frontFields: string,
    private readonly _backFields: string
  ) {}

  public get backFields(): string {
    return this._backFields;
  }
  public get frontFields(): string {
    return this._frontFields;
  }
  public get id(): number {
    return this._id;
  }
}
