import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { selectReviewCard } from "./reviewSlice";
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
import { GoBack } from "../back/GoBack";

interface MatchParams {
  bookId: string;
}

interface ReviewProps extends RouteComponentProps<MatchParams> {}

export function Review(props: ReviewProps) {
  const bookId = parseInt(props.match.params.bookId);
  const [initiated, setInitiated] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const [reviewCard, setReviewCard] = useState<CardInstanceVO | undefined>(undefined);

  const dispatch = useAppDispatch();
  useEffect(() => {
    async function inner() {
      if (!initiated) {
        const reviewCard = await serviceProvider.cardFacade.getNextReviewCardInstanceByBookId(
          bookId
        );
        setReviewCard(reviewCard);
        setInitiated(true);
      }
    }
    inner();
  }, []);

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

  if (!initiated) {
    return <></>;
  } else if (reviewCard == undefined) {
    return <div><GoBack /> No more review cards.</div>;
  } else {
    return (
      <div>
        <GoBack/>
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
