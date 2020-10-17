import { changeFieldContents } from "./addSlice";
import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface FieldProps {
  fieldTypeId: number;
  fieldName: string;
}
export const Field = (props: FieldProps) => {
  const [contents, setContents] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeFieldContents({
        fieldTypeId: props.fieldTypeId,
        contents: e.target.value,
      })
    );
  };

  return (
    <div>
      <span>{props.fieldName}: </span>
      <input value={contents} onChange={handleChange} />
    </div>
  );
};
