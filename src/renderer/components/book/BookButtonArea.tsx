import { Button} from "semantic-ui-react";
import * as React from "react";
import { WordStatus } from "../../../main/enum/WordStatus";
import serviceProvider from "../../ServiceProvider";
import { addItemToArray } from "../../utils/ImmutableUtils";
import history from "../../route/History";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectGlobalShortcutEnabled } from "../shortcut/shortcutSlice";
import {
  markCurrentWordAsProcessed,
  removeLastProcessedWord,
  retrieveWord,
  selectLastProcessedWordId,
  selectPageNo,
  selectWord,
  selectWordId,
  selectWordStatus,
  setPageNo,
} from "./bookSlice";
import { useAppDispatch } from "../../redux/store";

interface BookButtonAreaProps {
  bookId: number;
}

export const BookButtonArea = (props: BookButtonAreaProps) => {
  const dispatch = useAppDispatch();
  const globalShortcutEnabled = useSelector(selectGlobalShortcutEnabled);
  const pageNo = useSelector(selectPageNo);
  const word = useSelector(selectWord);
  const wordId = useSelector(selectWordId);
  const lastProcessedWordId = useSelector(selectLastProcessedWordId);
  const wordStatus = useSelector(selectWordStatus);

  useEffect(() => {
    if (globalShortcutEnabled) {
      bindShortcuts();
    }
    return unbindShortcuts;
  });

  const undo = async (): Promise<void> => {
    if (lastProcessedWordId === undefined) {
      return;
    }
    await serviceProvider.wordService.updateWord({
      id: lastProcessedWordId,
      status: wordStatus,
    });
    dispatch(removeLastProcessedWord());
    dispatch(retrieveWord())
  };
  const keyboardEventListener = async (e: KeyboardEvent) => {
    if (e.key === "k") {
      await handleKnowAndNext();
    } else if (e.key == "s") {
      await handleSkip();
    } else if (e.key === "n") {
      await handleNext();
    } else if (e.key === "p") {
      await handlePrevious();
    } else if (e.ctrlKey && e.key === "z") {
      await undo();
    }
  };
  const bindShortcuts = () => {
    document.addEventListener("keydown", keyboardEventListener);
  };

  const unbindShortcuts = () => {
    document.removeEventListener("keydown", keyboardEventListener);
  };

  const handlePrevious = async (): Promise<void> => {
    if (pageNo === 1) {
      return;
    }
    dispatch(setPageNo(pageNo - 1));
    dispatch(retrieveWord());
  };
  const handleKnowAndNext = async (): Promise<void> => {
    if (wordId === undefined) {
      return;
    }
    await serviceProvider.wordService.updateWord({
      id: wordId,
      status: WordStatus.KNOWN,
    });
    dispatch(markCurrentWordAsProcessed());
    dispatch(retrieveWord());
  };

  const handleNext = async (): Promise<void> => {
    if (wordId === undefined) {
      return;
    }
    dispatch(setPageNo(pageNo + 1));
    dispatch(retrieveWord());
  };

  const handleSkip = async (): Promise<void> => {
    if (wordId == undefined) {
      return;
    }
    await serviceProvider.wordService.updateWord({
      id: wordId,
      status: WordStatus.SKIPPED,
    });
    dispatch(markCurrentWordAsProcessed());
    dispatch(retrieveWord());
  }

  const handleAdd = async (): Promise<void> => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", word);
    history.push(`/add/new/${props.bookId}?${urlSearchParams.toString()}`);
  };


  return (

    <div>
      <Button
        disabled={pageNo === 1}
        onClick={handlePrevious}
      >
        Previous (p)
      </Button>
      <Button
        disabled={wordId == undefined}
        onClick={handleKnowAndNext}
      >
        Know and Next (k)
      </Button>
      <Button disabled={wordId == undefined}
              onClick={handleSkip}>Skip (s) </Button>
      <Button
        disabled={wordId == undefined}
        onClick={handleNext}
      >
        Next (n)
      </Button>
      <Button onClick={handleAdd}>Add (a)</Button>

    </div>
)
}