import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItemProps, DropdownProps, Grid, Modal } from "semantic-ui-react";
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

interface MatchParams {
  bookId: string;
}

interface BookProps extends RouteComponentProps<MatchParams> {}

export const Book = (props: BookProps) => {

  const initPageNo = (): Map<WordStatus, number> => {
    const pageNo = new Map<WordStatus, number>();
    for (const wordStatus in WordStatus) {
      if (!isNaN(Number(wordStatus))) {
        pageNo.set(Number(wordStatus), 1);
      }
    }
    return pageNo;
  }
  const bookId = parseInt(props.match.params.bookId);
  /**
   * The page number, starting from 1.
   */
  const [pageNo, _setPageNo] = useState(initPageNo());
  const pageNoRef = useRef(pageNo);
  const setPageNo = (pageNo: Map<WordStatus, number>) => {
    pageNoRef.current = pageNo;
    _setPageNo(pageNo);
  };

  const [initiated, setInitiated] = useState(false);
  const [bookName, setBookName] = useState("");
  const [wordStatus, _setWordStatus] = useState(WordStatus.Unknown);
  const wordStatusRef = useRef(wordStatus);
  const setWordStatus = (wordStatus: WordStatus) => {
    wordStatusRef.current = wordStatus;
    _setWordStatus(wordStatus);
  }
  /**
   * The current word.
   */
  const [wordVO, _setWordVO] = useState<WordVO | undefined>(undefined);
  const wordVORef = useRef(wordVO);
  const setWordVO = (wordVO: WordVO | undefined) => {
    wordVORef.current = wordVO;
    _setWordVO(wordVO);
  }

  /**
   * The index of the clicked context, used to show the long context modal.
   */
  const [longWordContextModalIndex, setLongWordContextModalIndex] = useState<number | undefined>(undefined);
  const [needRefresh, setNeedRefresh] = useState(true);
  /**
   * Word ids that are marked as known by the user.
   */
  const [markedKnownWords, _setMarkedKnownWords] = useState<number[]>([]);
  const markedKnownWordsRef = useRef(markedKnownWords);
  const setMarkedKnownWords = (markedKnownWords: number[]) => {
    markedKnownWordsRef.current = markedKnownWords;
    _setMarkedKnownWords(markedKnownWords);
  }
  const [wordCount, setWordCount] = useState<WordCount | undefined>();
  const globalShortcutEnabled = useSelector(selectGlobalShortcutEnabled);

  const refresh = async (): Promise<void> => {
    if (needRefresh) {
      const bookName = await getBookName(bookId);
      const wordVO = await getCurrentWord(bookId, getPageNo());
      const wordCount = await serviceProvider.wordService.getWordCount(bookId);
      setBookName(bookName);
      setWordVO(wordVO);
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
  }

  const getBookName = async (bookId: number): Promise<string> => {
    const bookVO = await serviceProvider.bookService.getBook(bookId);
    return bookVO.name;
  }

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
      5
    );
    if (wordVOArray.length === 0) {
      // FIXED later
      console.log("Nothing is found.");
    }
    setWordVO(wordVOArray[0]);
}

  const getCurrentWord = async (bookId: number, pageNo: number): Promise<WordVO | undefined> => {
    const wordVOArray = await serviceProvider.wordService.getWords(
      bookId,
      undefined,
      wordStatusRef.current,
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

  const handleStatusChange = (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ): void => {
    setNeedRefresh(true);
    setWordStatus(data.value as number);
  };

  const handleKnowAndNext = async (): Promise<void> => {
    await serviceProvider.wordService.updateWord({
      id: wordVORef.current!.id,
      status: WordStatus.Known,
    });
    const newWord = await getCurrentWord(
      parseInt(props.match.params.bookId),
      getPageNo()
    );
    setWordVO(newWord);
    setMarkedKnownWords(addItemToArray(markedKnownWordsRef.current, wordVORef.current!.id));
    setNeedRefresh(true);
  };

  const handleNext = async (): Promise<void> => {
    const newPageNo = new Map<WordStatus, number>(pageNoRef.current);
    newPageNo.set(wordStatus, getPageNo() + 1);
    setPageNo(newPageNo);
    setNeedRefresh(true);
  };

  const handleAdd = async (): Promise<void> => {
    const bookId = parseInt(props.match.params.bookId);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("word", wordVORef.current!.word);
    history.push(`/add/${bookId}?${urlSearchParams.toString()}`);
  };


  const getPageNo = (): number => {
    return pageNoRef.current.get(wordStatus) as number;
  }

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
  }

  const bindShortcuts = () => {
    console.log("bind");
    document.addEventListener("keydown", keyboardEventListener);
  }

  const unbindShortcuts = () => {
    console.log("unbind");
    document.removeEventListener("keydown", keyboardEventListener);
  }

  const handlePrevious = async (): Promise<void> => {
    const wordVO = await getCurrentWord(
      parseInt(props.match.params.bookId),
      getPageNo() - 1
    );
    const newPageNo = new Map<WordStatus, number>(pageNo);
    newPageNo.set(wordStatus, getPageNo() - 1);
    setWordVO(wordVO);
    setPageNo(newPageNo);
    setNeedRefresh(true);
  };

 const undo = async (): Promise<void> => {
    const newMarkedKnownWords = [...markedKnownWordsRef.current];
    const lastKnownWordId = newMarkedKnownWords.pop();
    await serviceProvider.wordService.updateWord({
      id: lastKnownWordId,
      status: WordStatus.Unknown,
    });
    setMarkedKnownWords(newMarkedKnownWords);
    setNeedRefresh(true);
 }
  useEffect(() => {
    (async function() {
      await refresh();
    })();
  }, [needRefresh]);

  useEffect(() => {
    if (globalShortcutEnabled) {
      bindShortcuts();
    } else {
      unbindShortcuts();
    }
  }, [globalShortcutEnabled]);

  return initiated ? (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <GoBack />
        </Grid.Column>
        <Grid.Column width={4}>Book: {bookName}</Grid.Column>
        <Grid.Column width={4}>
          <SearchWordInput onSearch={(word) => handleSearch(word)} />
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
            {wordVO!.contextList.map((context, i) => (
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
                onClose={() => setLongWordContextModalIndex(undefined)}
                onOpen={() => setLongWordContextModalIndex(i)}
                open={longWordContextModalIndex !== undefined}
              >
                <Modal.Header>Context</Modal.Header>
                <Modal.Content
                  dangerouslySetInnerHTML={{
                    __html: longWordContextModalIndex !== undefined
                      ? wordVO!.contextList[longWordContextModalIndex].long.htmlContents
                      : "",
                  }}
                />
                <Modal.Actions>
                  <Button
                    onClick={() => setLongWordContextModalIndex(undefined)}
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
}