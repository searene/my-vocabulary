import { IBeforeSaveCardHook } from "../card/BeforeSaveCardHook";

export class ConvertDictResourceService implements IBeforeSaveCardHook {
  process(card: Card): Promise<void> {}
}
