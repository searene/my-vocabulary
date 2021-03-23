import * as React from "react";
import { useEffect, useState } from "react";
import { Definition } from "./Definition";
import { SearchInput } from "./SearchInput";
import { useSelector } from "react-redux";
import { selectWord } from "../book/bookSlice";

interface DictionaryProps {}

export const Dictionary = (props: DictionaryProps) => {
  const [searchValue, setSearchValue] = useState("");
  const currentBookWord = useSelector(selectWord);

  const [word, setWord] = useState("");

  useEffect(() => {
    setSearchValue(currentBookWord);
    setWord(currentBookWord);
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
