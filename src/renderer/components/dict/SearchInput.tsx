import * as React from "react";
import * as Autosuggest from "react-autosuggest";
import { useState } from "react";
import serviceProvider from "../../ServiceProvider";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (word: string) => void;
}
export const SearchInput = (props: SearchInputProps) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestionValue = (suggestion: string) => suggestion;

  const renderSuggestion = (suggestion: string) => <div>{suggestion}</div>;

  const onChange = (
    event: React.FormEvent,
    { newValue }: Autosuggest.ChangeEvent
  ) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    const suggestedWords = serviceProvider.dictService.getSuggestedWords(value);
    setSuggestions(suggestedWords);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        placeholder: "Please input a word...",
        value,
        onChange,
      }}
    />
  );
};
