export class Utils {
  static sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  /**
   * bookId -> book_id
   */
  static camelToSnakeCase = (str: string): string =>
    str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
