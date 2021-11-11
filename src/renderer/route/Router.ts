import serviceProvider from "../ServiceProvider";
import history from "./History";

export class Router {

  static toLibraryPage() {
    history.push("/");
  }

  static toBookPage(bookId: number) {
    history.push(`/book/${bookId}`);
  }

  static toReviewPage(bookId?: number, cardInstanceId?: number) {
    const urlSearchParams = new URLSearchParams();
    if (bookId !== undefined) {
      urlSearchParams.set("bookId", bookId.toString());
    }
    if (cardInstanceId !== undefined) {
      urlSearchParams.set("cardInstanceId", cardInstanceId.toString());
    }
    const url = `/review?${urlSearchParams.toString()}`;
    history.push(url);
  }

  static toAddCardPage(bookId: number, word: string) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", word);
    urlSearchParams.set("bookId", bookId.toString());
    history.push(`/add/new?${urlSearchParams.toString()}`);
  }

  static toEditCardPage(cardInstanceId: number, word: string) {
    console.log(cardInstanceId);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", word);
    urlSearchParams.set("cardInstanceId", cardInstanceId.toString());
    history.push(`/add/edit?${urlSearchParams.toString()}`);
  }
}
