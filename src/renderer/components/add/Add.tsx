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
} from "./addSlice";
import { Field } from "./Field";
import { BookName } from "../bookName/BookName";
import { useAppDispatch } from "../../redux/store";
import { Router } from "../../route/Router";
import { GoBack } from "../back/GoBack";

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
  const dispatch = useAppDispatch();
  const [initiated, setInitiated] = useState(false);
  const [word, setWord] = useState(
    new URLSearchParams(props.location.search).get("word") as string
  );
  const bookId = parseInt(props.match.params.bookId);
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

  const getCardInstanceId = (url: string): number => {
    return parseInt(new URLSearchParams(url).get("cardInstanceId") as string);
  }

  useEffect(() => {
    if (!initiated) {
      if (editType === "new") {
        dispatch(getFieldTypes());
      } else if (editType === "edit") {
        dispatch(fetchFieldTypeIdToFieldVOMap({
          cardInstanceId: getCardInstanceId(props.location.search)
        }));
      }
    }
    setInitiated(true);
  }, [initiated, dispatch]);

  const save = () => {
    if (editType === "new") {
      dispatch(addCard({ word, bookId }))
        .then(() => Router.toBookPage(bookId))
        .catch((e) => {
          console.error("An error occurred when dispatching addCard");
          console.error(e);
        });
    } else if (editType === "edit") {
      const cardInstanceId = getCardInstanceId(props.location.search);
      dispatch(editCard({ cardInstanceId, fieldTypeIdToFieldVOMap }))
        .then(() => Router.toReviewPage(bookId, cardInstanceId))
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
          <GoBack/>Book: <BookName bookId={bookId} />
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
