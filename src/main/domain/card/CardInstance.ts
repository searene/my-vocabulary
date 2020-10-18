import { Card } from "./Card";

class CardInstance {
  constructor(
    private readonly _id: number,
    private readonly _compositionId: Composition
  ) {}

  static getNextDueCardInstance(
    bookId: number
  ): Promise<CardInstance | undefined> {
    throw new Error("not implemented");
  }

  static getTotalDueCardInstanceCount(bookId: number): Promise<number> {
    throw new Error("not implemented");
  }
}
