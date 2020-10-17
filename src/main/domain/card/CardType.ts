export class CardType {
  constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string,
    // fieldTypes that are bound to this cardType, separated by commas
    private readonly _fieldTypes: FieldType[]
  ) {}

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get fieldTypes(): FieldType[] {
    return this._fieldTypes;
  }
}
