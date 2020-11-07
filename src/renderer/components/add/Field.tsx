import { changeFieldContents, selectFieldTypeIdToFieldVOMap } from "./addSlice";
import * as React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import { RichEditor } from "../RichEditor";

interface FieldProps {
  fieldTypeId: number;
  fieldName: string;
}
export const Field = (props: FieldProps) => {
  const fieldTypeIdToFieldVOMap = useSelector(selectFieldTypeIdToFieldVOMap);
  const fieldVO = fieldTypeIdToFieldVOMap[props.fieldTypeId];

  const [contents, setContents] = React.useState("");

  const dispatch = useAppDispatch();

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
      <RichEditor value={contents} onChange={setContents} />
    </div>
  );
};
