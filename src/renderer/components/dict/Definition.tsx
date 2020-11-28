import * as React from "react";
console.log("asjdflaskfj");
console.log(__filename);
const DictParser = require("node-loader!/home/searene/WebstormProjects/my-vocabulary/build/Release/DictParser.node");

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
      {DictParser.hello()}
    </div>
  );
};
