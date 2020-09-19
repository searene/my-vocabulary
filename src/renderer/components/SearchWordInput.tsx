import * as React from "react";
import { Input } from "semantic-ui-react";
import { SyntheticEvent } from "react";

interface SearchWordInputProps {
  /**
   * Invoked when the user starts searching.
   */
  onSearch: (word: string) => Promise<void>;
}

interface SearchWordInputStates {
  /**
   * Search value
   */
  searchValue: string;
}

export class SearchWordInput extends React.Component<
  SearchWordInputProps,
  SearchWordInputStates
> {
  constructor(props: SearchWordInputProps) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  private handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await this.props.onSearch(this.state.searchValue);
    }
  };

  render() {
    return (
      <Input
        placeholder={"Search..."}
        value={this.state.searchValue}
        onChange={(e, data) => {
          this.setState({ searchValue: data.value });
        }}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
