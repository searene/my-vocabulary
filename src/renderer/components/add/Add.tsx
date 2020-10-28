import * as React from "react";
import { Button, Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  getFieldTypes,
  saveCard,
  selectFieldTypeIdToFieldVOMap,
} from "./addSlice";
import { Field } from "./Field";
import { BookName } from "../bookName/BookName";

interface MatchParams {
  bookId: string;
}

interface AddProps extends RouteComponentProps<MatchParams> {}

export function Add(props: AddProps) {
  const fieldTypeIdToFieldVOMap = useSelector(selectFieldTypeIdToFieldVOMap);
  const dispatch = useDispatch();
  const [initiated, setInitiated] = useState(false);
  const bookId = parseInt(props.match.params.bookId);

  const fieldComponents = Object.entries(fieldTypeIdToFieldVOMap).map(
    ([fieldTypeId, fieldVO]) => (
      <Grid.Row id={fieldTypeId}>
        <Field
          key={fieldTypeId}
          fieldTypeId={parseInt(fieldTypeId)}
          fieldName={fieldVO.name}
        />
      </Grid.Row>
    )
  );

  useEffect(() => {
    if (!initiated) {
      dispatch(getFieldTypes());
    }
    setInitiated(true);
  }, [initiated, dispatch]);

  const save = () => {
    dispatch(saveCard({ bookId }));
  };

  return initiated ? (
    <Grid divided={"vertically"}>
      <Grid.Row columns={1} id="book-name-row">
        <Grid.Column>
          Book: <BookName bookId={bookId} />
        </Grid.Column>
      </Grid.Row>
      {fieldComponents}
      <Grid.Row id="button-row">
        <Button onClick={save}>Save</Button>
      </Grid.Row>
    </Grid>
  ) : (
    <></>
  );
}
