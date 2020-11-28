import * as React from "react";
import serviceProvider from "../../ServiceProvider";

interface DefinitionProps {
  word: string;
}

export const Definition = (props: DefinitionProps) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
      }}
      dangerouslySetInnerHTML={{
        __html: serviceProvider.dictService.getHtml(props.word),
      }}
    ></div>
  );
};
