import * as React from "react";
import { useEffect, useState } from "react";
import { Definition } from "./Definition";
import { SearchInput } from "./SearchInput";
import { useSelector } from "react-redux";
import { selectOriginalWord } from "../book/bookSlice";

interface DictionaryProps {}

export const Dictionary = (props: DictionaryProps) => {
  const [searchValue, setSearchValue] = useState("");
  const currentBookWord = useSelector(selectOriginalWord);

  const [word, setWord] = useState("");

  useEffect(() => {
    if (currentBookWord !== undefined) {
      setSearchValue(currentBookWord);
      setWord(currentBookWord);
    }
  }, [currentBookWord]);

  return (
    <div style={{
      height: "80vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        onSearch={setWord}
      />
      <Definition word={word} />
    </div>
  );
};
