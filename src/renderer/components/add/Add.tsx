import * as React from "react";
import { Button, Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createEmptyCard, saveCard, selectCard } from "./addSlice";
import { Field } from "./Field";
import { BookName } from "../bookName/BookName";

interface MatchParams {
  bookId: string;
}

interface AddProps extends RouteComponentProps<MatchParams> {}

export function Add(props: AddProps) {
  const card = useSelector(selectCard);
  const dispatch = useDispatch();
  const [initiated, setInitiated] = useState(false);
  const bookId = parseInt(props.match.params.bookId);

  const fieldComponents =
    card == undefined ? (
      <></>
    ) : (
      card.fields.map(field => (
        <Grid.Row>
          <Field key={field.fieldType.id} field={field} />
        </Grid.Row>
      ))
    );

  useEffect(() => {
    if (!initiated) {
      dispatch(createEmptyCard({ bookId }));
    }
    setInitiated(true);
  }, [initiated, dispatch]);

  const save = () => {
    dispatch(saveCard());
  };

  return initiated ? (
    <Grid divided={"vertically"}>
      <Grid.Row columns={1}>
        <Grid.Column>
          Book: <BookName bookId={bookId} />
        </Grid.Column>
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
