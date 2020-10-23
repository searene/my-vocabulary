export class Composition {
  private constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _cardTypeId: number,
    private readonly _front: string,
    private readonly _back: string
  ) {}

  public static build(
    id: number,
    name: string,
    cardTypeId: number,
    front: string,
    back: string
  ) {
    return new Composition(id, cardTypeId, front, back);
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
    return this._back;
  }
  public get frontFields(): string {
    return this._front;
  }
}
