import history from "./History";

export class Router {

  static toLibraryPage() {
    history.push("/");
  }

  static toBookPage(bookId: number) {
    history.push(`/book/${bookId}`);
  }

  static toReviewPage(bookId: number, cardInstanceId?: number) {
    if (cardInstanceId === undefined) {
      history.push(`/review/${bookId}`);
    } else {
      history.push(`/review/${bookId}/${cardInstanceId}`);
    }
  }

  static toAddCardPage(bookId: number, word: string) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", word);
    history.push(`/add/new/${bookId}?${urlSearchParams.toString()}`);
  }

  static toEditCardPage(bookId: number, cardInstanceId: number, word: string) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", word);
    urlSearchParams.set("cardInstanceId", cardInstanceId.toString());
    history.push(`/add/edit/${bookId}?${urlSearchParams.toString()}`);
  }
}
