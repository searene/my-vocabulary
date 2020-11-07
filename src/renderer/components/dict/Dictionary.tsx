import * as React from "react";
import { useState } from "react";
import { Definition } from "./Definition";
import { SearchInput } from "./SearchInput";

interface DictionaryProps {}

export const Dictionary = (props: DictionaryProps) => {
  const [searchValue, setSearchValue] = useState("");

  const [word, setWord] = useState("");

  return (
    <div>
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        onSearch={setWord}
      />
      <Definition word={word} />
    </div>
  );
};
