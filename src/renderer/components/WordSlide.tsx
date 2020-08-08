import * as React from "react";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import { WordStatusInDatabase } from "../../main/enum/WordStatusInDatabase";
import { WordStatus } from "../../main/enum/WordStatus";

interface WordSlideProps {
  bookId: number;
  bookName: string;
}

interface WordSlideStates {

}

export class WordSlide extends React.Component<WordSlideProps, WordSlideStates> {

  render(): React.ReactNode {
    return (
      <div>
        <div>Book: {this.props.bookName}</div>
        <div>Status: <Dropdown fluid multiple selection
                               options={this.getWordStatusArray()} /></div>
      </div>
    )
  }
  private getWordStatusArray(): DropdownItemProps[] {
    for (const key in WordStatus) {
      console.log(key);
    }
    return [];
  }
}