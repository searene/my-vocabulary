import { changeFieldContents, selectFieldTypeIdToFieldVOMap } from "./addSlice";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FieldProps {
  fieldTypeId: number;
  fieldName: string;
}
export const Field = (props: FieldProps) => {
  const fieldTypeIdToFieldVOMap = useSelector(selectFieldTypeIdToFieldVOMap);
  const fieldVO = fieldTypeIdToFieldVOMap[props.fieldTypeId];

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
      <input value={fieldVO.contents} onChange={handleChange} />
    </div>
  );
};
