import history from "./History";

export class Router {
  static toBookPage(bookId: number) {
    history.push(`/book/${bookId}`);
  }
  static toReviewPage(bookId: number) {
    history.push(`/review/${bookId}`);
  }
}
