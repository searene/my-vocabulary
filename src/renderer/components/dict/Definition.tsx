import * as React from "react";

interface DefinitionProps {
  word: string;
}

export const Definition = (props: DefinitionProps) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
      }}
    >
      This is definition.
    </div>
  );
};
