import * as React from "react";
import { useEffect, useState } from "react";
import { Dropdown, DropdownItemProps, DropdownProps, Grid } from "semantic-ui-react";
import { WordStatus } from "../../../main/enum/WordStatus";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../../ServiceProvider";
import { SearchWordInput } from "../SearchWordInput";
import { GoBack } from "../back/GoBack";
import { ContextItem } from "./ContextItem";
import {
  retrieveWord, searchWord, selectContextList, selectOriginalWord,
  selectWordCount,
  selectWordStatus,
  setBookId,
  setWordStatus,
} from "./bookSlice";
import { useAppDispatch } from "../../redux/store";
import { BookButtonArea } from "./BookButtonArea";
import { useSelector } from "react-redux";
import { BookName } from "../bookName/BookName";

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {
}

export const Book = (props: BookProps) => {

  const dispatch = useAppDispatch();

  const bookId = parseInt(props.match.params.bookId);

  const [initiated, setInitiated] = useState(false);
  const wordStatus = useSelector(selectWordStatus);
  const originalWord = useSelector(selectOriginalWord);
  const contextList = useSelector(selectContextList);
  /**
   * The current word.
   */
  const wordCount = useSelector(selectWordCount);

  const getWordStatusArray = (): DropdownItemProps[] => {
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
  };

  const handleSearch = async (word: string): Promise<void> => {
    dispatch(searchWord({bookId, word}));
  };


  const handleStatusChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    dispatch(setWordStatus(data.value as number));
    dispatch(retrieveWord());
  };

  useEffect(() => {
    dispatch(setBookId(bookId));
    dispatch(retrieveWord())
      .then(() => {
        setInitiated(true);
      });
  }, []);


  return initiated ? (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <GoBack/>
        </Grid.Column>
        <Grid.Column width={4}><BookName bookId={bookId}/></Grid.Column>
        <Grid.Column width={4}>
          <SearchWordInput onSearch={(word) => handleSearch(word)}/>
        </Grid.Column>
        <Grid.Column width={4}>
          <Dropdown
            fluid
            selection
            placeholder={"Status"}
            options={getWordStatusArray()}
            value={wordStatus}
            onChange={handleStatusChange}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          Known: {wordCount!.known} / Unknown:{" "}
          {wordCount!.unknown}
        </Grid.Column>
      </Grid.Row>
      {originalWord == undefined ? (
        <div>No more words.</div>
      ) : (
        <>
          <Grid.Row><Grid.Column>Original Word: {originalWord}</Grid.Column></Grid.Row>
          <Grid.Row><Grid.Column>Status: {WordStatus[wordStatus]}</Grid.Column></Grid.Row>
          <Grid.Row><Grid.Column>
            <Grid.Row><Grid.Column>Context:</Grid.Column></Grid.Row>
            {contextList.map((context, i) =>
              <ContextItem key={i} short={context.short} long={context.long}/>,
            )}
          </Grid.Column>
          </Grid.Row>
        </>
      )}
      <Grid.Row>
        <Grid.Column width={16} textAlign={"left"}>
          <BookButtonArea bookId={bookId}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : <></>;
};