export class Composition {
  private constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _cardTypeId: number,
    private readonly _frontTypeIds: string,
    private readonly _backTypeIds: string
  ) {}

  public static build(
    id: number,
    name: string,
    cardTypeId: number,
    frontTypeIds: string,
    backTypeIds: string
  ) {
    return new Composition(id, name, cardTypeId, frontTypeIds, backTypeIds);
  }

  public get id(): number {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get cardTypeId(): number {
    return this._cardTypeId;
  }
  public get backFields(): string {
    return this._backTypeIds;
  }
  public get frontFields(): string {
    return this._frontTypeIds;
  }
}
