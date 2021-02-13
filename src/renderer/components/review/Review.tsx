import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { getNextReviewCard, selectReviewCard } from "./reviewSlice";
import { CardInstanceVO } from "../../../main/facade/CardFacade";
import { useEffect, useState } from "react";
import * as React from "react";
import { useAppDispatch } from "../../redux/store";
import { setIn } from "immutable";
import { Button } from "semantic-ui-react";
import { convertTimeIntervalToString } from "../../../main/domain/time/TimeInterval";

interface MatchParams {
  bookId: string;
}

interface ReviewProps extends RouteComponentProps<MatchParams> {}

export function Review(props: ReviewProps) {
  const bookId = parseInt(props.match.params.bookId);
  const [initiated, setInitiated] = useState(false);

  const reviewCard: CardInstanceVO | undefined = useSelector(selectReviewCard);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!initiated) {
      dispatch(getNextReviewCard({ bookId }));
      setInitiated(true);
    }
  });

  if (!initiated) {
    return <></>;
  } else if (reviewCard == undefined) {
    return <div>No more review cards.</div>;
  } else {
    return (
      <div>
        <div>{reviewCard.front}</div>
        <hr />
        <div>{reviewCard.back}</div>
        <hr />
        <div>
          {Object.entries(reviewCard.reviewTimeRecord).map(
            ([level, timeInterval]) => (
              <Button key={level}>
                {level}({convertTimeIntervalToString(timeInterval)})
              </Button>
            )
          )}
        </div>
      </div>
    );
  }
}
