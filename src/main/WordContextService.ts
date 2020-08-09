import { WordContextStep } from "./domain/WordContextStep";
import { WordContext } from "./domain/WordContext";
import { WordContextInner } from "./domain/WordContextInner";

export class WordContextService {
  static getContextList(
    positions: number[],
    bookContents: string,
    contextStep: WordContextStep,
    contextLimit: number
  ): WordContext[] {
    const contextList: WordContext[] = [];
    for (const pos of positions.slice(0, contextLimit)) {
      contextList.push({
        long: WordContextService.getWordContextInner(
          bookContents,
          pos,
          contextStep.long
        ),
        short: WordContextService.getWordContextInner(
          bookContents,
          pos,
          contextStep.short
        ),
      });
    }
    return contextList;
  }

  private static getWordContextInner(
    bookContents: string,
    wordPos: number,
    contextStep: number
  ): WordContextInner {
    const startPos = Math.max(0, wordPos - contextStep);
    const endPos = Math.min(bookContents.length, wordPos + contextStep);
    const contents = bookContents.substring(startPos, endPos);
    return { startPos, wordPos, endPos, contents };
  }
}
