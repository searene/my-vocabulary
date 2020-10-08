class CardType {
  constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string,

    private readonly _compositionArray: Composition[]
  ) {}

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get compositionArray(): Composition[] {
    return this.compositionArray;
  }
}
