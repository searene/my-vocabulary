import * as React from "react";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import { WordStatus } from "../../main/enum/WordStatus";
import { string } from "prop-types";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../ServiceProvider";

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {
}

interface BookStates {
  initiated: boolean;
  bookName: string;
}

export class Book extends React.Component<BookProps, BookStates> {

  constructor(props: BookProps) {
    super(props);
    this.state = {
      initiated: false,
      bookName: ""
    };
  }

  async componentDidMount() {
    const bookName = await this.getBookName(parseInt(this.props.match.params.bookId));
    this.setState({ initiated: true, bookName });
  }

  render(): React.ReactNode {
    if (!this.state.initiated) {
      return <></>
    }
    return (
      <div>
        <div>Book: {this.state.bookName}</div>
        <div>Status: <Dropdown fluid multiple selection
                               options={this.getWordStatusArray()} /></div>
      </div>
    )
  }
  private getWordStatusArray(): DropdownItemProps[] {
    const result = [];
    for (const key in WordStatus) {
      if (isNaN(Number(key))) {
        result.push({
          key: key,
          text: key,
          value: WordStatus[key]
        });
      }
    }
    return result;
  }
  private async getBookName(bookId: number): Promise<string> {
    const bookVO = await serviceProvider.bookService.getBook(bookId);
    return bookVO.name;
  }
}