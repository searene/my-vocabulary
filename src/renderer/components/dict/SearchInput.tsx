import * as React from "react";
import * as Autosuggest from "react-autosuggest";
import { useEffect, useState } from "react";
import serviceProvider from "../../ServiceProvider";
import { useAppDispatch } from "../../redux/store";
import { BlurEvent, ShouldRenderReasons } from "react-autosuggest";
import { disableGlobalShortcut, enableGlobalShortcut } from "../shortcut/shortcutSlice";
import { selectCurrentWord } from "../book/bookSlice";
import { useSelector } from "react-redux";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (word: string) => void;
}
export const SearchInput = (props: SearchInputProps) => {

  const [value, setValue] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const getSuggestionValue = (suggestion: string) => suggestion;

  const renderSuggestion = (suggestion: string) => <div>{suggestion}</div>;

  const onChange = (
    event: React.FormEvent,
    { newValue }: Autosuggest.ChangeEvent
  ) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
    const suggestedWords = await serviceProvider.dictService.getSuggestedWords(
      value
    );
    setSuggestions(suggestedWords);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected: Autosuggest.OnSuggestionSelected<string> = (
    event,
    { suggestion }
  ) => {
    props.onSearch(suggestion);
  };

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      props.onSearch(value);
    }
  };

  const handleShouldRenderSuggestions = (value: string, reason: ShouldRenderReasons) => {
    if (reason === "input-focused") {
      dispatch(disableGlobalShortcut());
    } else if (reason === "input-blurred") {
      dispatch(enableGlobalShortcut());
    }
    return true;
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={onSuggestionSelected}
      shouldRenderSuggestions={handleShouldRenderSuggestions}
      inputProps={{
        placeholder: "Please input a word...",
        value,
        onChange,
        onKeyDown: onInputKeyDown,
      }}
    />
  );
};
