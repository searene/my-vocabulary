import * as React from "react";
import { Icon, Input } from "semantic-ui-react";
import { KeyboardEventHandler, useState } from "react";

export interface BrowserDialogSearchInputProps {
  onStartSearching: (value: string) => void;
}

export const BrowserDialogSearchInput = (props: BrowserDialogSearchInputProps) => {

  const [value, setValue] = useState("");

  const handleKeyDown: KeyboardEventHandler = async (event) => {
    if (event.key === "Enter") {
      props.onStartSearching(value);
    }
  }

  return (
    <div>
      <Input icon placeholder='Search...'>
        <input value={value}
               onChange={(event) => setValue(event.target.value)}
               onKeyDown={handleKeyDown}
        />
        <Icon name='search' />
      </Input>
    </div>
  )
}
