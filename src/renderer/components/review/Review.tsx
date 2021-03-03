import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { useNextReviewCard, selectReviewCard } from "./reviewSlice";
import { CardInstanceVO } from "../../../main/facade/CardFacade";
import { useEffect, useState } from "react";
import * as React from "react";
import { useAppDispatch } from "../../redux/store";
import { Button } from "semantic-ui-react";
import {
  convertTimeIntervalToString,
  TimeInterval,
} from "../../../main/domain/time/TimeInterval";
import { Level } from "../../../main/domain/card/Level";
import serviceProvider from "../../ServiceProvider";

interface MatchParams {
  bookId: string;
}

interface ReviewProps extends RouteComponentProps<MatchParams> {}

export function Review(props: ReviewProps) {
  const bookId = parseInt(props.match.params.bookId);
  const [initiated, setInitiated] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const cardInstanceVO: CardInstanceVO | undefined = useSelector(
    selectReviewCard
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!initiated) {
      dispatch(useNextReviewCard({ bookId }));
      setInitiated(true);
    }
  }, [initiated]);

  const doReview = async function (
    level: Level,
    timeInterval: TimeInterval
  ): Promise<void> {
    await serviceProvider.cardFacade.review({
      cardInstanceId: cardInstanceVO!.id,
      level,
      timeInterval,
    });
    dispatch(useNextReviewCard({ bookId }));
    setShowBack(false);
  };

  if (!initiated) {
    return <></>;
  } else if (cardInstanceVO == undefined) {
    return <div>No more review cards.</div>;
  } else {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: cardInstanceVO.front }} />
        <hr />
        {showBack ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: cardInstanceVO.back }} />
            <hr />
            <div>
              {Object.entries(cardInstanceVO.reviewTimeRecord).map(
                ([level, timeInterval]) => (
                  <Button
                    key={level}
                    onClick={() => doReview(level as Level, timeInterval)}
                  >
                    {level}({convertTimeIntervalToString(timeInterval)})
                  </Button>
                )
              )}
            </div>
          </>
        ) : (
          <Button onClick={() => setShowBack(true)}>Show Answer</Button>
        )}
      </div>
    );
  }
}
