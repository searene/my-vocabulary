import { fromString } from "html-to-text";

export class HtmlToText {
  static toText(html: string): string {
    return fromString(html, {
      wordwrap: false,
    });
  }
}
