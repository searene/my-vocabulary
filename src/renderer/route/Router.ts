import history from "./History";

export class Router {

  static toLibraryPage() {
    history.push("/");
  }

  static toBookPage(bookId: number) {
    history.push(`/book/${bookId}`);
  }

  static toReviewPage(bookId: number) {
    history.push(`/review/${bookId}`);
  }
}
