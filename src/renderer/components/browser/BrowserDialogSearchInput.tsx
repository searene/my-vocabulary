import * as React from "react";
import { Icon, Input } from "semantic-ui-react";
import { KeyboardEventHandler } from "react";

export interface BrowserDialogSearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const BrowserDialogSearchInput = (props: BrowserDialogSearchInputProps) => {

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
    }
  }

  return (
    <div>
      <Input icon placeholder='Search...'>
        <input value={props.value}
               onChange={(event) => props.onValueChange(event.target.value)}
               onKeyDown={handleKeyDown}
        />
        <Icon name='search' />
      </Input>
    </div>
  )
}
