import { BaseQuery } from "./BaseQuery";

export class CardTypeQuery extends BaseQuery {
  private _name: string | undefined;

  get name(): string | undefined {
    return this._name;
  }

  set name(value: string | undefined) {
    this._name = value;
  }
}
