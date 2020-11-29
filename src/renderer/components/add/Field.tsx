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
  const handleRichEditorChange = (value: string) => {
    dispatch(
      changeFieldContents({
        fieldTypeId: props.fieldTypeId,
        contents: value,
      })
    );
  };

  return (
    <div>
      <span>{props.fieldName}: </span>
      <RichEditor value={fieldVO.contents} onChange={handleRichEditorChange} />
    </div>
  );
};
