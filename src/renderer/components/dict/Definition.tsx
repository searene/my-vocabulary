import * as React from "react";
import { useEffect, useState } from "react";
import serviceProvider from "../../ServiceProvider";

interface DefinitionProps {
  word: string;
}

export const Definition = (props: DefinitionProps) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function fetchHtml() {
      const fetchedHtml = await serviceProvider.dictService.getHtml(props.word);
      setHtml(fetchedHtml);
    }
    fetchHtml();
  }, [props.word]);

  return (
    <div style={{
      border: "1px solid #ccc",
      overflow: "auto",
      flexGrow: 1,
    }}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
