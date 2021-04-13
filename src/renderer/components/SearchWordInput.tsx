import { useState, KeyboardEvent } from "react";
import * as React from "react";
import { Input } from "semantic-ui-react";
import { disableGlobalShortcut, enableGlobalShortcut } from "./shortcut/shortcutSlice";
import { useAppDispatch } from "../redux/store";

interface SearchWordInputProps {
  /**
   * Invoked when the user starts searching.
   */
  onSearch: (word: string) => Promise<void>;
}

export const SearchWordInput = (props: SearchWordInputProps) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await props.onSearch(searchValue);
    }
  };

  const handleFocus = () => {
    dispatch(disableGlobalShortcut());
  }

  const handleBlur = () => {
    dispatch(enableGlobalShortcut());
  }

  return (
    <Input
      placeholder={"Search..."}
      value={searchValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={(e, data) => {
        setSearchValue(data.value);
      }}
      onKeyDown={handleKeyDown}
    />
  );
}
