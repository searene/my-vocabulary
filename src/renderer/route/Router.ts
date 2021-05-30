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

  static toEditCardPage(bookId: number, cardInstanceId: number, word: string) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", word);
    history.push(`/add/edit/${bookId}/${cardInstanceId}?${urlSearchParams.toString()}`);
  }
}
