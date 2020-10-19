class Review {
  constructor(
    private readonly id: number,
    private readonly reviewTime: Date,
    private level: Level
  ) {}

  async save(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
