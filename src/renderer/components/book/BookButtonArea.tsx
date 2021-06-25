import * as React from 'react';
import { Button} from "semantic-ui-react";
import { WordStatus } from "../../../main/enum/WordStatus";
import serviceProvider from "../../ServiceProvider";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectGlobalShortcutEnabled } from "../shortcut/shortcutSlice";
import {
  markCurrentWordAsProcessed,
  removeLastProcessedWord,
  retrieveWord,
  selectLastProcessedWord,
  selectPageNo,
  selectWord,
  selectWordStatus,
  setPageNo,
} from "./bookSlice";
import { useAppDispatch } from "../../redux/store";
import { Router } from "../../route/Router";

interface BookButtonAreaProps {
  bookId: number;
}

export const BookButtonArea = (props: BookButtonAreaProps) => {
  const dispatch = useAppDispatch();
  const globalShortcutEnabled = useSelector(selectGlobalShortcutEnabled);
  const pageNo = useSelector(selectPageNo);
  const word = useSelector(selectWord);
  const lastProcessedWord = useSelector(selectLastProcessedWord);
  const wordStatus = useSelector(selectWordStatus);

  useEffect(() => {
    if (globalShortcutEnabled) {
      bindShortcuts();
    }
    return unbindShortcuts;
  });

  const undo = async (): Promise<void> => {
    if (lastProcessedWord === undefined) {
      return;
    }
    await serviceProvider.wordService.updateWordStatus(props.bookId, lastProcessedWord, wordStatus);
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
    if (word === undefined) {
      return;
    }
    await serviceProvider.wordService.updateWordStatus(props.bookId, word, WordStatus.KNOWN);
    dispatch(markCurrentWordAsProcessed());
    dispatch(retrieveWord());
  };

  const handleNext = async (): Promise<void> => {
    if (word === undefined) {
      return;
    }
    dispatch(setPageNo(pageNo + 1));
    dispatch(retrieveWord());
  };

  const handleSkip = async (): Promise<void> => {
    if (word == undefined) {
      return;
    }
    await serviceProvider.wordService.updateWordStatus(props.bookId, word, WordStatus.SKIPPED);
    dispatch(markCurrentWordAsProcessed());
    dispatch(retrieveWord());
  }

  const handleAdd = async (): Promise<void> => {
    Router.toAddCardPage(props.bookId, word as string);
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
        disabled={word == undefined}
        onClick={handleKnowAndNext}
      >
        Know and Next (k)
      </Button>
      <Button disabled={word == undefined}
              onClick={handleSkip}>Skip (s) </Button>
      <Button
        disabled={word == undefined}
        onClick={handleNext}
      >
        Next (n)
      </Button>
      <Button onClick={handleAdd}>Add (a)</Button>

    </div>
)
}