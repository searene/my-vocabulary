export class NumberUtils {

  /**
   * @param from inclusive
   * @param to inclusive
   */
  static getRandomNumber(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from)
  }
}
