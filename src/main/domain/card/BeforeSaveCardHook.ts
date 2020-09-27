import { Card } from "./Card";

export interface IBeforeSaveCardHook {
  /**
   * You get a chance to change the card before saving it into database.
   */
  process(card: Card): Promise<void>;
}
