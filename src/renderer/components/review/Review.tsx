import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { CardInstanceVO } from "../../../main/facade/CardFacade";
import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import {
  convertTimeIntervalToString,
  TimeInterval,
} from "../../../main/domain/time/TimeInterval";
import { Level } from "../../../main/domain/card/Level";
import serviceProvider from "../../ServiceProvider";
import { GoBack } from "../back/GoBack";
import { ReviewElement } from "./ReviewElement";
import { selectGlobalShortcutEnabled } from "../shortcut/shortcutSlice";
import history from "../../route/History";
import * as React from 'react';
import { Router } from "../../route/Router";

interface MatchParams {
  bookId: string;
}

interface ReviewProps extends RouteComponentProps<MatchParams> {}

export function Review(props: ReviewProps) {
  const bookId = parseInt(props.match.params.bookId);
  const [initiated, setInitiated] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const globalShortcutEnabled = useSelector(selectGlobalShortcutEnabled);

  const [reviewCard, setReviewCard] = useState<CardInstanceVO | undefined>(undefined);

  const pronounce = async function(html: string) {
    const el = document.createElement('html');
    el.innerHTML = html;
    const imgs = el.getElementsByTagName("img");
    var clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i] as HTMLImageElement;
      if (img.onclick != null) {
        await img.onclick(clickEvent);
      }
    }
  }

  useEffect(() => {
    async function inner() {
      if (!initiated) {
        const reviewCard = await serviceProvider.cardFacade.getNextReviewCardInstanceByBookId(
          bookId
        );
        setReviewCard(reviewCard);
        pronounce(reviewCard!.front);
        setInitiated(true);
      }
    }
    inner();
  }, []);

  useEffect(() => {
    bindShowAnswerShortcut();
    return unbindShowAnswerShortcut;
  });

  useEffect(() => {
    if (globalShortcutEnabled) {
      bindLevelShortcuts();
    }
    return unbindShortcuts;
  });

  const bindLevelShortcuts = function() {
    document.addEventListener("keydown", keyboardEventListener);
  }

  const unbindShortcuts = function() {
    document.removeEventListener("keydown", keyboardEventListener);
  }

  const bindShowAnswerShortcut = function() {
    document.addEventListener("keydown", showAnswerKeyboardEventListener);
  }

  const unbindShowAnswerShortcut = function() {
    document.removeEventListener("keydown", showAnswerKeyboardEventListener);
  }

  const showAnswerKeyboardEventListener = function(e: KeyboardEvent) {
    if (e.key === ' ') {
      handleShowAnswer();
    }
  }

  const keyboardEventListener = async function(e: KeyboardEvent) {
    for (const reviewElement of ReviewElement.buildReviewElementArray(reviewCard!.reviewTimeRecord)) {
      if (e.key === reviewElement.getShortcut()) {
        await doReview(reviewElement.level, reviewElement.timeInterval);
      }
    }
  }

  const doReview = async function (
    level: Level,
    timeInterval: TimeInterval
  ): Promise<void> {
    await serviceProvider.cardFacade.review({
      cardInstanceId: reviewCard!.id,
      level,
      timeInterval,
    });
    const nextReviewCard = await serviceProvider.cardFacade.getNextReviewCardInstanceByBookId(
      bookId
    );
    setReviewCard(nextReviewCard);
    setShowBack(false);
  };

  const handleShowAnswer = function() {
    if (showBack) {
      return;
    }
    setShowBack(true);
    pronounce(reviewCard!.back);
    unbindShowAnswerShortcut();
  }

  const edit = () => {
    Router.toEditCardPage(bookId, reviewCard!.id, reviewCard!.word);
  }

  if (!initiated) {
    return <></>;
  } else if (reviewCard == undefined) {
    return <div><GoBack /> No more review cards.</div>;
  } else {
    return (
      <div>
        <GoBack/>
        <div>
          <Button onClick={edit}>Edit</Button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: reviewCard.front }} style={{
          marginTop: "20px"
        }}/>
        <hr />
        {showBack ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: reviewCard.back }} />
            <hr />
            <div>
              {Object.entries(reviewCard.reviewTimeRecord).map(
                ([level, timeInterval]) => (
                  <Button
                    key={level}
                    onClick={() => doReview(level as Level, timeInterval)}
                  >
                    {level} - {convertTimeIntervalToString(timeInterval)} ({ReviewElement.getShortcutFromLevel(level as Level)})
                  </Button>
                )
              )}
            </div>
          </>
        ) : (
          <Button onClick={handleShowAnswer}>Show Answer (SPACE)</Button>
        )}
      </div>
    );
  }
}
