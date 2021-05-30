import { changeFieldContents, selectFieldTypeIdToFieldVOMap } from "./addSlice";
import * as React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import { RichEditor } from "./editor/RichEditor";
import { GoogleImageEditor } from "./editor/GoogleImageEditor";
import { FieldVO } from "../../../main/facade/vo/FieldVO";

interface FieldProps {
  fieldTypeId: number;
  fieldName: string;
  word: string;
}
export const Field = (props: FieldProps) => {
  const fieldTypeIdToFieldVOMap = useSelector(selectFieldTypeIdToFieldVOMap);
  const fieldVO = fieldTypeIdToFieldVOMap[props.fieldTypeId];

  const dispatch = useAppDispatch();

  const handleRichEditorChange = (originalContents: string, plainTextContents: string) => {
    dispatch(
      changeFieldContents({
        fieldTypeId: props.fieldTypeId,
        originalContents,
        plainTextContents,
      })
    );
  };

  const getEditor = (fieldVO: FieldVO) => {
    if (fieldVO.category === "text") {
      return <RichEditor htmlContents={fieldVO.originalContents} onChange={handleRichEditorChange} />;
    } else if (fieldVO.category == "google-image") {
      return <GoogleImageEditor word={props.word} onChange={(value) => handleRichEditorChange(value, "")} />
    } else {
      throw new Error("Unsupported category: " + fieldVO.category);
    }
  }

  return (
    <div style={{width: "100%", marginLeft: "5px", marginRight: "5px"}}>
      <span>{props.fieldName}: </span>
      {getEditor(fieldVO)}
    </div>
  );
};
