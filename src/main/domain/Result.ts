export class Result<T> {
  private constructor(
    // The returned object.
    private data: T | undefined,

    // Whether it's successful.
    private success: boolean,

    // Failed message if success is false.
    private msg: string
  ) {}

  static returnSuccess<T>(data: T): Result<T> {
    return new Result<T>(data, true, "");
  }

  static returnFail<T>(msg: string): Result<T> {
    return new Result<T>(undefined, false, msg);
  }
}
