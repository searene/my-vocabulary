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

  const getFieldComponents = () => {
    console.log(fieldTypeIdToFieldVOMap);
    for (const [fieldTypeId, fieldVO] of Object.entries(
      fieldTypeIdToFieldVOMap
    )) {
      <Grid.Row>
        <Field
          key={fieldTypeId}
          fieldTypeId={parseInt(fieldTypeId)}
          fieldName={fieldVO.name}
        />
      </Grid.Row>;
    }
  };

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
      <Grid.Row columns={1}>
        <Grid.Column>
          Book: <BookName bookId={bookId} />
        </Grid.Column>
      </Grid.Row>
      {getFieldComponents()}
      <Grid.Row>
        <Button onClick={save}>Save</Button>
      </Grid.Row>
    </Grid>
  ) : (
    <></>
  );
}
