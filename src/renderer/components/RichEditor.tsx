import * as React from "react";
import { useEffect, useRef } from "react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichEditor = React.memo((props: RichEditorProps) => {
  const contentEditableDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentEditableDiv.current!.addEventListener("input", () => {
      props.onChange(contentEditableDiv.current!.innerHTML);
    });
  });

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      ref={contentEditableDiv}
    >
      {props.value}
    </div>
  );
});
