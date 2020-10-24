export class CardType {
  private constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string
  ) {}

  static get(id: number, name: string): CardType {
    return new CardType(id, name);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
