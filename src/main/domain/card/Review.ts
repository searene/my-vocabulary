class Review {
  constructor(
    private readonly id: number,
    private readonly reviewTime: Date,
    private level: Level
  ) {}

  save(): Promise<void> {}
}
