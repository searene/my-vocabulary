import * as React from "react";
import {
  Button,
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Grid,
  Modal,
} from "semantic-ui-react";
import { WordStatus } from "../../main/enum/WordStatus";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../ServiceProvider";
import { WordVO } from "../../main/database/WordVO";
import { Link } from "react-router-dom";
import { Optional } from "typescript-optional";
import { WordCount } from "../../main/domain/WordCount";

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
  wordCount: WordCount;
  longWordContextModalIndex: Optional<number>;
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
    this.state = {
      initiated: false,
      bookName: "",
      wordStatus: WordStatus.Unknown,
      pageNo: pageNo,
      wordVO: Optional.empty(),
      wordCount: { unknown: 0, known: 0 },
      longWordContextModalIndex: Optional.empty(),
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
          <Grid.Column width={4}>
            Known: {this.state.wordCount.known} / Unknown:{" "}
            {this.state.wordCount.unknown}
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
                    <Modal
                      key={i}
                      trigger={
                        <Grid.Row
                          className={"hover-link"}
                          dangerouslySetInnerHTML={{
                            __html: context.short.htmlContents,
                          }}
                        />
                      }
                      onClose={() =>
                        this.setState({
                          longWordContextModalIndex: Optional.empty(),
                        })
                      }
                      onOpen={() =>
                        this.setState({
                          longWordContextModalIndex: Optional.of(i),
                        })
                      }
                      open={this.state.longWordContextModalIndex.isPresent()}
                    >
                      <Modal.Header>Context</Modal.Header>
                      <Modal.Content
                        dangerouslySetInnerHTML={{
                          __html: this.state.longWordContextModalIndex.isPresent()
                            ? this.state.wordVO.get().contextList[
                                this.state.longWordContextModalIndex.get()
                              ].long.htmlContents
                            : "",
                        }}
                      />
                      <Modal.Actions>
                        <Button
                          onClick={() =>
                            this.setState({
                              longWordContextModalIndex: Optional.empty(),
                            })
                          }
                        >
                          Close
                        </Button>
                      </Modal.Actions>
                    </Modal>
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
      {
        short: 100,
        long: 500,
      },
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
    const wordCount = await serviceProvider.wordService.getWordCount(bookId);
    if (this.needRefresh(wordVO, wordCount)) {
      this.setState({ initiated: true, bookName, wordVO, wordCount });
    }
    this.bindShortcuts();
  };

  private getPageNo(): number {
    return this.state.pageNo.get(this.state.wordStatus) as number;
  }

  private needRefresh(wordVO: Optional<WordVO>, wordCount: WordCount) {
    return this.isWordVOChanged(wordVO) || this.isWordCountChanged(wordCount);
  }

  /**
   * Check if wordVO is changed
   */
  private isWordVOChanged(wordVO: Optional<WordVO>) {
    if (wordVO.isEmpty() && this.state.wordVO.isEmpty()) {
      return false;
    }
    return !(
      wordVO.isPresent() &&
      this.state.wordVO.isPresent() &&
      wordVO.get().id === this.state.wordVO.get().id
    );
  }

  private isWordCountChanged(wordCount: WordCount) {
    return (
      wordCount.known !== this.state.wordCount.known ||
      wordCount.unknown !== this.state.wordCount.unknown
    );
  }

  private handleContextClick = (contextIndex: number) => {
    console.log("here");
    this.setState({
      longWordContextModalIndex: Optional.of(contextIndex),
    });
  };

  private bindShortcuts() {
    document.addEventListener("keyup", async e => {
      if (e.key === "k") {
        await this.handleKnowAndNext();
      } else if (e.key === "n") {
        await this.handleNext();
      }
    });
  }
}
