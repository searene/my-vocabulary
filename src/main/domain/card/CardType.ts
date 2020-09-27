class CardType {
  constructor(
    // CardType id
    private readonly id: number,
    // CardType name
    private readonly name: string,

    private compositions: Composition[]
  ) {}
}
