import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItemProps, DropdownProps, Grid } from "semantic-ui-react";
import { WordStatus } from "../../../main/enum/WordStatus";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../../ServiceProvider";
import { WordVO } from "../../../main/database/WordVO";
import { WordCount } from "../../../main/domain/WordCount";
import { SearchWordInput } from "../SearchWordInput";
import history from "../../route/History";
import { addItemToArray } from "../../utils/ImmutableUtils";
import { GoBack } from "../back/GoBack";
import { useSelector } from "react-redux";
import { selectGlobalShortcutEnabled } from "../shortcut/shortcutSlice";
import { ContextItem } from "./ContextItem";
import { selectCurrentWord, setCurrentWord } from "./bookSlice";
import { useAppDispatch } from "../../redux/store";

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {
}

export const Book = (props: BookProps) => {

  const dispatch = useAppDispatch();

  const initPageNo = (): Map<WordStatus, number> => {
    const pageNo = new Map<WordStatus, number>();
    for (const wordStatus in WordStatus) {
      if (!isNaN(Number(wordStatus))) {
        pageNo.set(Number(wordStatus), 1);
      }
    }
    return pageNo;
  };
  const bookId = parseInt(props.match.params.bookId);
  /**
   * The page number, starting from 1.
   */
  const [pageNo, setPageNo] = useState(initPageNo());

  const [initiated, setInitiated] = useState(false);
  const [bookName, setBookName] = useState("");
  const [wordStatus, setWordStatus] = useState(WordStatus.Unknown);
  /**
   * The current word.
   */
  const wordVO = useSelector(selectCurrentWord);

  const [needRefresh, setNeedRefresh] = useState(true);
  /**
   * Word ids that are marked as known by the user.
   */
  const [markedKnownWords, setMarkedKnownWords] = useState<number[]>([]);
  const [wordCount, setWordCount] = useState<WordCount | undefined>();
  const globalShortcutEnabled = useSelector(selectGlobalShortcutEnabled);

  const refresh = async (): Promise<void> => {
    if (needRefresh) {
      const bookName = await getBookName(bookId);
      const wordVO = await getCurrentWord(bookId, getPageNo());
      const wordCount = await serviceProvider.wordService.getWordCount(bookId);
      setBookName(bookName);
      dispatch(setCurrentWord(wordVO));
      setWordCount(wordCount);
      setNeedRefresh(false);
      setInitiated(true);
    }
  };

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

  const getBookName = async (bookId: number): Promise<string> => {
    const bookVO = await serviceProvider.bookService.getBook(bookId);
    return bookVO.name;
  };

  const handleSearch = async (word: string): Promise<void> => {
    const bookId = parseInt(props.match.params.bookId);
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      word,
      wordStatus,
      1,
      1,
      {
        short: 100,
        long: 500,
      },
      5,
    );
    if (wordVOArray.length === 0) {
      // FIXED later
      console.log("Nothing is found.");
    }
    dispatch(setCurrentWord(wordVOArray[0]));
  };

  const getCurrentWord = async (bookId: number, pageNo: number): Promise<WordVO | undefined> => {
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      undefined,
      wordStatus,
      pageNo,
      1,
      {
        short: 100,
        long: 500,
      },
      5,
    );
    if (wordVOArray.length === 0) {
      return undefined;
    }
    return wordVOArray[0];
  };

  const handleStatusChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    setNeedRefresh(true);
    setWordStatus(data.value as number);
  };

  const handleKnowAndNext = async (): Promise<void> => {
    await serviceProvider.wordService.updateWord({
      id: wordVO!.id,
      status: WordStatus.Known,
    });
    const newWord = await getCurrentWord(
      parseInt(props.match.params.bookId),
      getPageNo(),
    );
    setMarkedKnownWords(addItemToArray(markedKnownWords, wordVO!.id));
    dispatch(setCurrentWord(newWord));
    setNeedRefresh(true);
  };

  const handleNext = async (): Promise<void> => {
    if (wordVO === undefined) {
      return;
    }
    const newPageNo = new Map<WordStatus, number>(pageNo);
    newPageNo.set(wordStatus, getPageNo() + 1);
    setPageNo(newPageNo);
    setNeedRefresh(true);
  };

  const handleAdd = async (): Promise<void> => {
    const bookId = parseInt(props.match.params.bookId);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", wordVO!.word);
    history.push(`/add/${bookId}?${urlSearchParams.toString()}`);
  };


  const getPageNo = (): number => {
    return pageNo.get(wordStatus) as number;
  };

  const keyboardEventListener = async (e: KeyboardEvent) => {
    if (e.key === "k") {
      await handleKnowAndNext();
    } else if (e.key === "n") {
      await handleNext();
    } else if (e.key === "p") {
      await handlePrevious();
    } else if (e.ctrlKey && e.key === "z") {
      await undo();
    }
  };

  const bindShortcuts = () => {
    document.addEventListener("keydown", keyboardEventListener);
  };

  const unbindShortcuts = () => {
    document.removeEventListener("keydown", keyboardEventListener);
  };

  const handlePrevious = async (): Promise<void> => {
    if (getPageNo() === 1) {
      return;
    }
    const wordVO = await getCurrentWord(
      parseInt(props.match.params.bookId),
      getPageNo() - 1,
    );
    const newPageNo = new Map<WordStatus, number>(pageNo);
    newPageNo.set(wordStatus, getPageNo() - 1);
    dispatch(setCurrentWord(wordVO));
    setPageNo(newPageNo);
    setNeedRefresh(true);
  };

  const undo = async (): Promise<void> => {
    if (markedKnownWords.length === 0) {
      return;
    }
    const newMarkedKnownWords = [...markedKnownWords];
    const lastKnownWordId = newMarkedKnownWords.pop();
    await serviceProvider.wordService.updateWord({
      id: lastKnownWordId,
      status: WordStatus.Unknown,
    });
    setMarkedKnownWords(newMarkedKnownWords);
    setNeedRefresh(true);
  };
  useEffect(() => {
    (async function() {
      await refresh();
    })();
  }, [needRefresh]);

  useEffect(() => {
    if (globalShortcutEnabled) {
      bindShortcuts();
    }
    return unbindShortcuts;
  });

  return initiated ? (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <GoBack/>
        </Grid.Column>
        <Grid.Column width={4}>Book: {bookName}</Grid.Column>
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
      {wordVO == undefined ? (
        <div>No more words.</div>
      ) : (
        <>
          <Grid.Row><Grid.Column>Word: {wordVO!.word}</Grid.Column></Grid.Row>
          <Grid.Row><Grid.Column>Original Word: {wordVO!.originalWord}</Grid.Column></Grid.Row>
          <Grid.Row><Grid.Column>Status: {WordStatus[wordVO!.status]}</Grid.Column></Grid.Row>
          <Grid.Row><Grid.Column>
            <Grid.Row><Grid.Column>Context:</Grid.Column></Grid.Row>
            {wordVO!.contextList.map((context, i) =>
              <ContextItem key={i} short={context.short} long={context.long}/>,
            )}
          </Grid.Column>
          </Grid.Row>
        </>
      )}
      <Grid.Row>
        <Grid.Column width={16} textAlign={"left"}>
          <Button
            disabled={pageNo.get(wordStatus) === 1}
            onClick={handlePrevious}
          >
            Previous (p)
          </Button>
          <Button
            disabled={wordVO == undefined}
            onClick={handleKnowAndNext}
          >
            Know and Next (k)
          </Button>
          <Button
            disabled={wordVO == undefined}
            onClick={handleNext}
          >
            Next (n)
          </Button>
          <Button onClick={handleAdd}>Add (a)</Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : <></>;
};