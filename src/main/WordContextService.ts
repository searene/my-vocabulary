import { WordContextStep } from "./domain/WordContextStep";
import { WordContext } from "./domain/WordContext";
import { WordContextInner } from "./domain/WordContextInner";

export class WordContextService {
  static getContextList(
    word: string,
    positions: number[],
    bookContents: string,
    contextStep: WordContextStep,
    contextLimit: number
  ): WordContext[] {
    const contextList: WordContext[] = [];
    for (const pos of positions.slice(0, contextLimit)) {
      contextList.push({
        long: WordContextService.getWordContextInner(
          word,
          bookContents,
          pos,
          contextStep.long
        ),
        short: WordContextService.getWordContextInner(
          word,
          bookContents,
          pos,
          contextStep.short
        ),
      });
    }
    return contextList;
  }

  private static getWordContextInner(
    word: string,
    bookContents: string,
    wordPos: number,
    contextStep: number
  ): WordContextInner {
    const startPos = Math.max(0, wordPos - contextStep);
    const endPos = Math.min(bookContents.length, wordPos + contextStep);
    const plainContents = bookContents.substring(startPos, endPos);
    const htmlContents = `${bookContents.substring(startPos, wordPos)}
      <span class="highlight">${bookContents.substring(
        wordPos,
        wordPos + word.length
      )}</span>
      ${bookContents.substring(wordPos + word.length, endPos)}`;
    return { startPos, wordPos, endPos, plainContents, htmlContents };
  }
}
