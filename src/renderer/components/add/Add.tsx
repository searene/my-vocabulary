import * as React from "react";
import { Button, Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createCard, saveCard, selectCardVO } from "./addSlice";
import { Field } from "./Field";
import { BookName } from "../bookName/BookName";

interface MatchParams {
  bookId: string;
}

interface AddProps extends RouteComponentProps<MatchParams> {}

export function Add(props: AddProps) {
  const cardVO = useSelector(selectCardVO);
  const dispatch = useDispatch();
  const [initiated, setInitiated] = useState(false);
  const bookId = parseInt(props.match.params.bookId);

  const fieldComponents = cardVO?.fieldVOs.map(fieldVO => (
    <Grid.Row>
      <Field
        key={fieldVO.fieldTypeId}
        fieldTypeId={fieldVO.fieldTypeId}
        fieldName={fieldVO.fieldName}
      />
    </Grid.Row>
  ));

  useEffect(() => {
    if (!initiated) {
      dispatch(createCard({ bookId }));
    }
    setInitiated(true);
  }, [initiated, dispatch]);

  const save = () => {
    dispatch(saveCard({ bookId }));
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
