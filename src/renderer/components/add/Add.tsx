import * as React from "react";
import { Button, Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchFieldTypeIdToFieldVOMap,
  getFieldTypes,
  saveCard,
  selectFieldTypeIdToFieldVOMap,
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

  useEffect(() => {
    if (!initiated) {
      if (props.match.params.editType === "new") {
        dispatch(getFieldTypes());
      } else if (props.match.params.editType === "edit") {
        const cardInstanceId = parseInt(props.match.params.cardInstanceId as string);
        dispatch(fetchFieldTypeIdToFieldVOMap({ cardInstanceId }));
      }
    }
    setInitiated(true);
  }, [initiated, dispatch]);

  const save = () => {
    dispatch(saveCard({ word, bookId }))
      .then(() => Router.toBookPage(bookId))
      .catch((e) => {
        console.error("An error occurred when dispatching saveCard");
        console.error(e);
      });
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
