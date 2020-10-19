import { IBeforeSaveCardHook } from "../card/BeforeSaveCardHook";
import { Card } from "../card/Card";

export class ConvertDictResourceService implements IBeforeSaveCardHook {
  async process(card: Card): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
