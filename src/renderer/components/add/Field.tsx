import { changeFieldContents, FieldVO, selectFieldTypeIdToFieldVOMap } from "./addSlice";
import * as React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import { RichEditor } from "./editor/RichEditor";
import { GoogleImageEditor } from "./editor/GoogleImageEditor";

interface FieldProps {
  fieldTypeId: number;
  fieldName: string;
  word: string;
}
export const Field = (props: FieldProps) => {
  const fieldTypeIdToFieldVOMap = useSelector(selectFieldTypeIdToFieldVOMap);
  const fieldVO = fieldTypeIdToFieldVOMap[props.fieldTypeId];

  const dispatch = useAppDispatch();

  const handleRichEditorChange = (value: string) => {
    dispatch(
      changeFieldContents({
        fieldTypeId: props.fieldTypeId,
        contents: value,
      })
    );
  };

  const getEditor = (fieldVO: FieldVO) => {
    if (fieldVO.category === "text") {
      return <RichEditor value={fieldVO.contents} onChange={handleRichEditorChange} />;
    } else if (fieldVO.category == "google-image") {
      return <GoogleImageEditor word={props.word} onChange={handleRichEditorChange} />
    } else {
      throw new Error("Unsupported category: " + fieldVO.category);
    }
  }

  return (
    <div>
      <span>{props.fieldName}: </span>
      {getEditor(fieldVO)}
    </div>
  );
};
