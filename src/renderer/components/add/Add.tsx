import * as React from "react";
import { Button, Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchFieldTypeIdToFieldVOMap,
  getFieldTypes,
  addCard as addCard,
  selectFieldTypeIdToFieldVOMap,
  editCard,
  selectBookId,
  getBookId,
} from "./addSlice";
import { Field } from "./Field";
import { BookName } from "../bookName/BookName";
import { useAppDispatch } from "../../redux/store";
import { Router } from "../../route/Router";
import { GoBack } from "../back/GoBack";
import { CardInstance } from "../../../main/domain/card/instance/CardInstance";
import serviceProvider from "../../ServiceProvider";

export type EditType = "new" | "edit";

interface MatchParams {
  bookId: string;
  editType: EditType;

  // Only exist when editType === "edit"
  cardInstanceId?: string | undefined;
}

interface AddProps extends RouteComponentProps<MatchParams> {}

export function Add(props: AddProps) {

  const fieldTypeIdToFieldVOMap = useSelector(selectFieldTypeIdToFieldVOMap);
  const bookId = useSelector(selectBookId);
  const dispatch = useAppDispatch();
  const [initiated, setInitiated] = useState(false);
  const [word, setWord] = useState(
    new URLSearchParams(props.location.search).get("word") as string
  );
  const editType = props.match.params.editType;

  const fieldComponents = Object.entries(fieldTypeIdToFieldVOMap).map(
    ([fieldTypeId, fieldVO]) => (
      <Grid.Row key={fieldTypeId}>
        <Field
          key={fieldTypeId}
          fieldTypeId={parseInt(fieldTypeId)}
          fieldName={fieldVO.name}
          word={word}
        />
      </Grid.Row>
    )
  );

  const tryGetCardInstanceIdFromUrl = (): number | undefined => {
    const url = props.location.search;
    const cardInstanceIdStr = new URLSearchParams(url).get("cardInstanceId");
    if (cardInstanceIdStr === undefined) {
      return undefined;
    }
    return parseInt(cardInstanceIdStr as string);
  }

  const tryGetBookIdFromUrl = (): number | undefined => {
    const url = props.location.search;
    const cardInstanceIdStr = new URLSearchParams(url).get("bookId");
    if (cardInstanceIdStr === undefined) {
      return undefined;
    }
    return parseInt(cardInstanceIdStr as string);
  }

  useEffect(() => {
    dispatch(getBookId({
      bookIdFromUrl: tryGetBookIdFromUrl(),
      cardInstanceId: tryGetCardInstanceIdFromUrl()
    }));
    if (!initiated) {
      if (editType === "new") {
        dispatch(getFieldTypes());
      } else if (editType === "edit") {
        dispatch(fetchFieldTypeIdToFieldVOMap({
          cardInstanceId: tryGetCardInstanceIdFromUrl() as number
        }));
      }
    }
    setInitiated(true);
  }, [initiated, dispatch]);

  const save = async () => {
    if (editType === "new") {
      dispatch(addCard({ word, bookId: bookId as number}))
        .then(() => Router.toBookPage(bookId as number))
        .catch((e) => {
          console.error("An error occurred when dispatching addCard");
          console.error(e);
        });
    } else if (editType === "edit") {
      const cardInstanceId = tryGetCardInstanceIdFromUrl() as number;
      dispatch(editCard({ cardInstanceId, fieldTypeIdToFieldVOMap }))
        .then(() => Router.toReviewPage(cardInstanceId))
        .catch((e) => {
          console.error("An error occurred when dispatching editCard");
          console.error(e);
        });
    }
  };

  return initiated ? (
    <Grid divided={"vertically"}>
      <Grid.Row columns={1}>
        <Grid.Column>
          <GoBack/>Book: <BookName bookId={bookId as number} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <span>word: </span>
        <input value={word} onChange={(e) => setWord(e.target.value)} />
      </Grid.Row>
      {fieldComponents}
      <Grid.Row>
        <Button onClick={save}>Save</Button>
      </Grid.Row>
    </Grid>
  ) : (
    <></>
  );
}
