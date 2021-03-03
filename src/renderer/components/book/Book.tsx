import * as React from "react";
import {
  Button,
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Grid,
  Modal,
} from "semantic-ui-react";
import { WordStatus } from "../../../main/enum/WordStatus";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../../ServiceProvider";
import { WordVO } from "../../../main/database/WordVO";
import { Link } from "react-router-dom";
import { Optional } from "typescript-optional";
import { WordCount } from "../../../main/domain/WordCount";
import { SearchWordInput } from "../SearchWordInput";
import history from "../../route/History";
import { addItemToArray } from "../../utils/ImmutableUtils";
import { container } from "../../../main/config/inversify.config";
import { WordRepository } from "../../../main/infrastructure/repository/WordRepository";
import { types } from "../../../main/config/types";
import { GoBack } from "../back/GoBack";

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {}

interface BookStates {
  /**
   * Is the initialization completed.
   */
  initiated: boolean;

  /**
   * The name of the current book.
   */
  bookName: string;

  /**
   * Which kinds of word does the user want to see, unknown or known?
   */
  wordStatus: WordStatus;

  /**
   * The page number, starting from 1.
   */
  pageNo: Map<WordStatus, number>;

  /**
   * The current word.
   */
  wordVO: WordVO | undefined;

  /**
   * The count of known words, unknown words, etc.
   */
  wordCount: WordCount;

  /**
   * The index of the clicked context, used to show the long context modal.
   */
  longWordContextModalIndex: Optional<number>;

  needRefresh: boolean;

  /**
   * Word ids that are marked as known by the user.
   */
  markedKnownWords: number[];
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
      wordVO: undefined,
      wordCount: { unknown: 0, known: 0 },
      longWordContextModalIndex: Optional.empty(),
      needRefresh: true,
      markedKnownWords: [],
    };
  }

  async componentDidMount() {
    await this.refresh();
    this.bindShortcuts();
    this.setState({
      markedKnownWords: [],
    });
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
            <GoBack />
          </Grid.Column>
          <Grid.Column width={4}>Book: {this.state.bookName}</Grid.Column>
          <Grid.Column width={4}>
            <SearchWordInput onSearch={(word) => this.handleSearch(word)} />
          </Grid.Column>
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
        {this.state.wordVO == undefined ? (
          <div>No more words.</div>
        ) : (
          <>
            <Grid.Row><Grid.Column>Word: {this.state.wordVO.word}</Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>Original Word: {this.state.wordVO.originalWord}</Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>Status: {WordStatus[this.state.wordVO.status]}</Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>
              <Grid.Row><Grid.Column>Context:</Grid.Column></Grid.Row>
              {this.state.wordVO.contextList.map((context, i) => (
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
                        ? this.state.wordVO!.contextList[
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
            </Grid.Column>
            </Grid.Row>
          </>
        )}
        <Grid.Row>
          <Grid.Column width={16} textAlign={"left"}>
            <Button
              disabled={this.state.pageNo.get(this.state.wordStatus) === 1}
              onClick={this.handlePrevious}
            >
              Previous (p)
            </Button>
            <Button
              disabled={this.state.wordVO == undefined}
              onClick={this.handleKnowAndNext}
            >
              Know and Next (k)
            </Button>
            <Button
              disabled={this.state.wordVO == undefined}
              onClick={this.handleNext}
            >
              Next (n)
            </Button>
            <Button onClick={this.handleAdd}>Add (a)</Button>
          </Grid.Column>
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

  private async handleSearch(word: string): Promise<void> {
    const bookId = parseInt(this.props.match.params.bookId);
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      word,
      this.state.wordStatus,
      1,
      1,
      {
        short: 100,
        long: 500,
      },
      5
    );
    if (wordVOArray.length === 0) {
      // FIXED later
      console.log("Nothing is found.");
    }
    this.setState({
      wordVO: wordVOArray[0],
    });
  }

  private async getCurrentWord(
    bookId: number,
    pageNo: number
  ): Promise<WordVO | undefined> {
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      undefined,
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
      return undefined;
    }
    return wordVOArray[0];
  }

  private handleStatusChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ): void => {
    this.setState({
      needRefresh: true,
      wordStatus: data.value as number,
    });
  };

  private handleKnowAndNext = async (): Promise<void> => {
    await serviceProvider.wordService.updateWord({
      id: this.state.wordVO!.id,
      status: WordStatus.Known,
    });
    const wordVO = await this.getCurrentWord(
      parseInt(this.props.match.params.bookId),
      this.getPageNo()
    );
    this.setState({
      needRefresh: true,
      wordVO,
      markedKnownWords: addItemToArray(
        this.state.markedKnownWords,
        this.state.wordVO!.id
      ),
    });
  };

  private handleNext = async (): Promise<void> => {
    const wordVO = await this.getCurrentWord(
      parseInt(this.props.match.params.bookId),
      this.getPageNo() + 1
    );
    const newPageNo = new Map<WordStatus, number>(this.state.pageNo);
    newPageNo.set(this.state.wordStatus, this.getPageNo() + 1);
    this.setState({
      needRefresh: true,
      wordVO,
      pageNo: newPageNo,
    });
  };

  private handleAdd = async (): Promise<void> => {
    const bookId = parseInt(this.props.match.params.bookId);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", this.state.wordVO!.word);
    history.push(`/add/${bookId}?${urlSearchParams.toString()}`);
  };

  private refresh = async (): Promise<void> => {
    const bookId = parseInt(this.props.match.params.bookId);
    const bookName = await Book.getBookName(bookId);
    const wordVO = await this.getCurrentWord(bookId, this.getPageNo());
    const wordCount = await serviceProvider.wordService.getWordCount(bookId);
    if (this.state.needRefresh) {
      this.setState({
        initiated: true,
        bookName,
        wordVO,
        wordCount,
        needRefresh: false,
      });
    }
  };

  private getPageNo(): number {
    return this.state.pageNo.get(this.state.wordStatus) as number;
  }

  /**
   * Check if wordVO is changed
   */
  private isWordVOChanged(wordVO: Optional<WordVO>) {
    if (wordVO.isEmpty() && this.state.wordVO == undefined) {
      return false;
    }
    return !(
      wordVO.isPresent() &&
      this.state.wordVO != undefined &&
      wordVO.get().id === this.state.wordVO.id
    );
  }

  private isWordCountChanged(wordCount: WordCount) {
    return (
      wordCount.known !== this.state.wordCount.known ||
      wordCount.unknown !== this.state.wordCount.unknown
    );
  }

  private bindShortcuts() {
    document.addEventListener("keyup", async (e) => {
      if (e.key === "k") {
        await this.handleKnowAndNext();
      } else if (e.key === "n") {
        await this.handleNext();
      } else if (e.key === "p") {
        await this.handlePrevious();
      }
    });
    document.addEventListener("keydown", async (event) => {
      if (event.ctrlKey && event.key === "z") {
        await this.undo();
      }
    });
  }

  private handlePrevious = async (): Promise<void> => {
    const wordVO = await this.getCurrentWord(
      parseInt(this.props.match.params.bookId),
      this.getPageNo() - 1
    );
    const newPageNo = new Map<WordStatus, number>(this.state.pageNo);
    newPageNo.set(this.state.wordStatus, this.getPageNo() - 1);
    this.setState({
      needRefresh: true,
      wordVO,
      pageNo: newPageNo,
    });
  };

  private async undo(): Promise<void> {
    const newMarkedKnownWords = [...this.state.markedKnownWords];
    const lastKnownWordId = newMarkedKnownWords.pop();
    await serviceProvider.wordService.updateWord({
      id: lastKnownWordId,
      status: WordStatus.Unknown,
    });
    this.setState({
      needRefresh: true,
      markedKnownWords: newMarkedKnownWords,
    });
    await this.refresh();
  }
}
