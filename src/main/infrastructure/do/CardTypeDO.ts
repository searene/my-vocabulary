import { BaseDO } from "./BaseDO";

export class CardTypeDO extends BaseDO {
  private _name: string | undefined;

  get name(): string | undefined {
    return this._name;
  }

  set name(value: string | undefined) {
    this._name = value;
  }
}
