import { Card } from "./Card";

class CardInstance {
  private reviews: Review[] = [];

  constructor(
    private id: number,
    private composition: Composition,
    private card: Card
  ) {}

  static getNextDueCardInstance(
    bookId: number
  ): Promise<CardInstance | undefined> {}

  static getTotalDueCardInstanceCount(bookId: number): Promise<number> {}
}
