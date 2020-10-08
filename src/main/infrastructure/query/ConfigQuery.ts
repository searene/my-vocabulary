import { BaseQuery } from "./BaseQuery";

export class ConfigQuery extends BaseQuery {
  private _defaultCardTypeId: number | undefined;

  get defaultCardTypeId(): number | undefined {
    return this._defaultCardTypeId;
  }

  set defaultCardTypeId(value: number | undefined) {
    this._defaultCardTypeId = value;
  }
}
