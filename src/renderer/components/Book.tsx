import * as React from "react";
import {
  Button,
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Grid,
} from "semantic-ui-react";
import { WordStatus } from "../../main/enum/WordStatus";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../ServiceProvider";
import { WordVO } from "../../main/database/WordVO";
import { Link } from "react-router-dom";
import { Optional } from "typescript-optional";

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {}

interface BookStates {
  initiated: boolean;
  bookName: string;
  wordStatus: WordStatus;
  pageNo: Map<WordStatus, number>;
  wordVO: Optional<WordVO>;
}

export class Book extends React.Component<BookProps, BookStates> {
  constructor(props: BookProps) {
    super(props);
    const pageNo = new Map<WordStatus, number>();
    for (const wordStatus in WordStatus) {
      if (!isNaN(Number(wordStatus))) {
        pageNo.set(Number(wordStatus), 1);
      }
    }
    console.log(pageNo);
    this.state = {
      initiated: false,
      bookName: "",
      wordStatus: WordStatus.Unknown,
      pageNo: pageNo,
      wordVO: Optional.empty(),
    };
  }

  async componentDidMount() {
    await this.refresh();
  }

  async componentDidUpdate() {
    await this.refresh();
  }

  render(): React.ReactNode {
    if (!this.state.initiated) {
      return <></>;
    }
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Link to={"/"}>Back to Library</Link>
          </Grid.Column>
          <Grid.Column width={4}>Book: {this.state.bookName}</Grid.Column>
          <Grid.Column width={4}>
            <Dropdown
              fluid
              selection
              placeholder={"Status"}
              options={Book.getWordStatusArray()}
              value={this.state.wordStatus}
              onChange={this.handleStatusChange}
            />
          </Grid.Column>
        </Grid.Row>
        {this.state.wordVO.isEmpty() ? (
          <div>No more words.</div>
        ) : (
          <Grid.Row>
            <Grid>
              <Grid.Row>Word: {this.state.wordVO.get().word}</Grid.Row>
              <Grid.Row>
                Original Word: {this.state.wordVO.get().originalWord}
              </Grid.Row>
              <Grid.Row>
                Status: {WordStatus[this.state.wordVO.get().status]}
              </Grid.Row>
              <Grid.Row>
                <Grid>
                  <Grid.Row>Context:</Grid.Row>
                  {this.state.wordVO.get().contextList.map((context, i) => (
                    <Grid.Row key={i}>{context}</Grid.Row>
                  ))}
                </Grid>
              </Grid.Row>
            </Grid>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16} textAlign={"right"}>
                <Button
                  disabled={this.state.wordVO.isEmpty()}
                  onClick={this.handleKnowAndNext}
                >
                  Know and Next
                </Button>
                <Button
                  disabled={this.state.wordVO.isEmpty()}
                  onClick={this.handleNext}
                >
                  Next
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Row>
      </Grid>
    );
  }

  private static getWordStatusArray(): DropdownItemProps[] {
    const result = [];
    for (const key in WordStatus) {
      if (isNaN(Number(key))) {
        result.push({
          key: key,
          text: key,
          value: WordStatus[key],
        });
      }
    }
    return result;
  }

  private static async getBookName(bookId: number): Promise<string> {
    const bookVO = await serviceProvider.bookService.getBook(bookId);
    return bookVO.name;
  }

  private async getCurrentWord(
    bookId: number,
    pageNo: number
  ): Promise<Optional<WordVO>> {
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      this.state.wordStatus,
      pageNo,
      1,
      50,
      5
    );
    if (wordVOArray.length === 0) {
      return Optional.empty();
    }
    return Optional.of(wordVOArray[0]);
  }

  private handleStatusChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ): void => {
    this.setState({
      wordStatus: data.value as number,
    });
  };

  private handleKnowAndNext = async (): Promise<void> => {
    await serviceProvider.wordService.updateWord({
      id: this.state.wordVO.get().id,
      status: WordStatus.Known,
    });
    const wordVO = await this.getCurrentWord(
      parseInt(this.props.match.params.bookId),
      this.getPageNo()
    );
    this.setState({
      wordVO,
    });
  };

  private handleNext = async (): Promise<void> => {
    const wordVO = await this.getCurrentWord(
      parseInt(this.props.match.params.bookId),
      this.getPageNo() + 1
    );
    console.log(this.state.pageNo);
    const newPageNo = new Map<WordStatus, number>(this.state.pageNo);
    newPageNo.set(this.state.wordStatus, this.getPageNo() + 1);
    console.log(newPageNo);
    this.setState({
      wordVO,
      pageNo: newPageNo,
    });
  };

  private refresh = async (): Promise<void> => {
    const bookId = parseInt(this.props.match.params.bookId);
    const bookName = await Book.getBookName(bookId);
    const wordVO = await this.getCurrentWord(bookId, this.getPageNo());
    if (wordVO.isEmpty() && this.state.wordVO.isEmpty()) {
      return;
    }
    if (
      wordVO.isPresent() &&
      this.state.wordVO.isPresent() &&
      wordVO.get().id === this.state.wordVO.get().id
    ) {
      return;
    }
    this.setState({ initiated: true, bookName, wordVO });
  };

  private getPageNo(): number {
    return this.state.pageNo.get(this.state.wordStatus) as number;
  }
}
