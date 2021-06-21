import { WordContextStep } from "./domain/WordContextStep";
import { WordContext } from "./domain/WordContext";
import { WordContextInner } from "./domain/WordContextInner";

export class WordContextService {
  static getContextList(
    word: string,
    positions: WordPosition[],
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
    wordPos: WordPosition,
    contextStep: number
  ): WordContextInner {
    const startPos = Math.max(0, wordPos.startWordPos - contextStep);
    const endPos = Math.min(bookContents.length, wordPos.startWordPos + contextStep);
    const plainContents = bookContents.substring(startPos, endPos);
    const htmlContents = `${bookContents.substring(startPos, endPos)}
      <span class="highlight">${bookContents.substring(
        wordPos.startWordPos,
        wordPos.endWordPos,
      )}</span>
      ${bookContents.substring(wordPos.endWordPos, endPos)}`;
    return {
      contextStartPos: startPos,
      wordStartPos: wordPos.startWordPos,
      wordEndPos: wordPos.endWordPos,
      contextEndPos: endPos,
      plainContents, htmlContents
    };
  }
}
