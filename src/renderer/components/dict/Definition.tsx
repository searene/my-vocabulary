import * as React from "react";
import { useEffect, useRef, useState } from "react";
import serviceProvider from "../../ServiceProvider";

interface DefinitionProps {
  word: string;
}

export const Definition = (props: DefinitionProps) => {
  const [html, setHtml] = useState("");
  const definitionDisplayDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHtml() {
      const fetchedHtml = await serviceProvider.dictService.getHtml(props.word);
      setHtml(fetchedHtml);
      definitionDisplayDiv.current?.scrollTo(0, 0);
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
      ref={definitionDisplayDiv}
    />
  );
};
