import * as React from "react";
import { Button, Dropdown, DropdownItemProps, DropdownProps, Grid } from "semantic-ui-react";
import { WordStatus } from "../../main/enum/WordStatus";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../ServiceProvider";
import { WordVO } from "../../main/database/WordVO";
import { Link } from "react-router-dom";

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {
}

interface BookStates {
  initiated: boolean;
  bookName: string;
  statuses: number[];
  pageNo: number;
  wordVO: WordVO;
}

export class Book extends React.Component<BookProps, BookStates> {

  constructor(props: BookProps) {
    super(props);
    this.state = {
      initiated: false,
      bookName: "",
      statuses: [],
      pageNo: 1,
      wordVO: {
        id: -1,
        word: "",
        originalWord: "",
        contextList: [],
        status: WordStatus.Unknown
      }
    };
  }

  async componentDidMount() {
    const bookId = parseInt(this.props.match.params.bookId);
    const bookName = await this.getBookName(bookId);
    const wordVO = await this.getCurrentWord(bookId, this.state.pageNo);
    this.setState({ initiated: true, bookName, wordVO });
  }

  render(): React.ReactNode {
    if (!this.state.initiated) {
      return <></>
    }
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Link to={"/"}>Back to Library</Link>
          </Grid.Column>
          <Grid.Column width={4}>
            Book: {this.state.bookName}
          </Grid.Column>
          <Grid.Column width={4}>
            <Dropdown fluid multiple selection placeholder={"Status"}
                      options={this.getWordStatusArray()}
                      value={this.state.statuses}
                      onChange={this.handleStatusChange}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid>
            <Grid.Row>Word: {this.state.wordVO.word}</Grid.Row>
            <Grid.Row>Original Word: {this.state.wordVO.originalWord}</Grid.Row>
            <Grid.Row>Status: {WordStatus[this.state.wordVO.status]}</Grid.Row>
            <Grid.Row>Context:
              <Grid>
                {this.state.wordVO.contextList.map((context, i) =>
                  <Grid.Row key={i}>
                    {context}
                  </Grid.Row>
                )}
              </Grid>
            </Grid.Row>
          </Grid>
        </Grid.Row>
        <Grid.Row>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16} textAlign={"right"}>
                <Button onClick={this.handleKnowAndNext}>Know and Next</Button>
                <Button>Next</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Row>
      </Grid>
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

  private async getCurrentWord(bookId: number, pageNo: number): Promise<WordVO> {
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      this.state.statuses[0],
      pageNo,
      1,
      5
      );
    if (wordVOArray.length === 0) {
      throw new Error("No more words");
    }
    return wordVOArray[0];
  }

  private handleStatusChange = (event: React.SyntheticEvent<HTMLElement>,
                                data: DropdownProps): void => {
    this.setState({
      statuses: data.value as number[]
    });
  };

  private handleKnowAndNext = async (): Promise<void> => {
    await serviceProvider.wordService.updateWord({
      id: this.state.wordVO.id,
      status: WordStatus.Known
    });
    const wordVO = await this.getCurrentWord(
      parseInt(this.props.match.params.bookId), this.state.pageNo);
    this.setState({
      wordVO, pageNo: this.state.pageNo + 1
    });
  }
}