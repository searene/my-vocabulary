export class ConfigDO {
  private _id: number | undefined;

  private _defaultCardTypeId: number | undefined;

  get id(): number | undefined {
    return this._id;
  }

  set id(value: number | undefined) {
    this._id = value;
  }

  get defaultCardTypeId(): number | undefined {
    return this._defaultCardTypeId;
  }

  set defaultCardTypeId(value: number | undefined) {
    this._defaultCardTypeId = value;
  }
}
