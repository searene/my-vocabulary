import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WordStatus } from "../../../main/enum/WordStatus";
import serviceProvider from "../../ServiceProvider";
import { WordVO } from "../../../main/database/WordVO";
import { WordContext } from "../../../main/domain/WordContext";
import { ALL_ZEROS_WORD_COUNT, WordCount } from "../../../main/domain/WordCount";

interface State {
  book: BookState;
}

interface StringToNumberType {
  [index: string]: number;
}

interface StringToStringArrayType {
  [index: string]: string[];
}

interface BookState {
  wordId: number | undefined;
  wordStatus: WordStatus;
  wordStatusToPageNoMap: StringToNumberType;
  wordStatusToProcessedWordsMap: StringToStringArrayType;
  originalWord: string | undefined;
  contextList: WordContext[];
  wordCount: WordCount;
  bookId: number | undefined;
  bookName: string | undefined;
}

const initWordStatusToPageNoMap = (): StringToNumberType => {
  const result: StringToNumberType = {};
  for (const wordStatus in WordStatus) {
    if (!isNaN(Number(wordStatus))) {
      result[wordStatus.toString()] = 1;
    }
  }
  return result;
}

const initWordStatusToProcessedWordIdsMap = (): StringToStringArrayType => {
  const result: StringToStringArrayType = {};
  for (const wordStatus in WordStatus) {
    if (!isNaN(Number(wordStatus))) {
      result[wordStatus.toString()] = [];
    }
  }
  return result;
}

const initialState: BookState = {
  wordId: undefined,
  wordStatus: WordStatus.UNKNOWN,
  wordStatusToPageNoMap: initWordStatusToPageNoMap(),
  wordStatusToProcessedWordsMap: initWordStatusToProcessedWordIdsMap(),
  originalWord: "",
  contextList: [],
  wordCount: { ...ALL_ZEROS_WORD_COUNT },
  bookId: undefined,
  bookName: undefined,
};

const getCurrentWord = async (bookId: number, pageNo: number, wordStatus: WordStatus): Promise<WordVO | undefined> => {
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

export const refreshBookName = createAsyncThunk<
  { bookName: string },
  number,
  { state: State }
>("book/refreshBookName", async (bookId: number, { getState }) => {
  const bookVO = await serviceProvider.bookService.getBook(bookId);
  return {
    bookName: bookVO.name
  };
});

export const retrieveWord = createAsyncThunk<
  { originalWord: string | undefined, contextList: WordContext[], wordCount: WordCount},
  void,
  {state: State}
>("book/retrieveWord", async (_, {getState}) => {
  const pageNo = getState().book.wordStatusToPageNoMap[getState().book.wordStatus];
  const wordVO = await getCurrentWord(getState().book.bookId as number, pageNo, getState().book.wordStatus);
  const wordCount = await serviceProvider.wordService.getWordCount(getState().book.bookId as number);
  return {
    originalWord: wordVO === undefined ? undefined : wordVO.originalWord,
    contextList: wordVO === undefined ? [] : wordVO.contextList,
    wordCount: wordCount,
  }
});

export const searchWord = createAsyncThunk<
  { originalWord: string | undefined, contextList: WordContext[]},
  {bookId: number, word: string},
  {state: State}
>("book/searchWord", async ({bookId, word}, {getState}) => {
  const wordVOArray = await serviceProvider.wordService.getWords(
    bookId,
    word,
    getState().book.wordStatus,
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
  const wordVO = wordVOArray[0];
  return {
    originalWord: wordVO.originalWord,
    contextList: wordVO.contextList
  }
})

const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  reducers: {
    setWordStatus: (state, action) => {
      state.wordStatus = action.payload;
    },
    setPageNo: (state, action) => {
      state.wordStatusToPageNoMap[state.wordStatus.toString()] = action.payload;
    },
    setBookId: (state, action) => {
      state.bookId = action.payload;
    },
    markCurrentWordAsProcessed: (state) => {
      state.wordStatusToProcessedWordsMap[state.wordStatus.toString()].push(state.originalWord as string);
    },
    removeLastProcessedWord: (state) => {
      state.wordStatusToProcessedWordsMap[state.wordStatus.toString()].pop();
    }
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveWord.fulfilled, (state, action) => {
      state.originalWord = action.payload.originalWord;
      state.contextList = action.payload.contextList;
      state.wordCount = action.payload.wordCount;
    });
    builder.addCase(retrieveWord.rejected, (state, action) => {
      console.error("Error in retrieveWord");
      console.error(action.error);
    });
    builder.addCase(searchWord.fulfilled, (state, action) => {
      state.originalWord = action.payload.originalWord;
      state.contextList = action.payload.contextList;
    });
    builder.addCase(searchWord.rejected, (state, action) => {
      console.error("Error in searchWord");
      console.error(action.error);
    });
    builder.addCase(refreshBookName.fulfilled, (state, action) => {
      state.bookName = action.payload.bookName;
    });
    builder.addCase(refreshBookName.rejected, (state, action) => {
      console.error("Error in refreshBookName");
      console.error(action.error);
    });
  },
});

export const { markCurrentWordAsProcessed, setBookId, setWordStatus, setPageNo, removeLastProcessedWord } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
export const selectOriginalWord = (state: State) => state.book.originalWord;
export const selectContextList = (state: State) => state.book.contextList;
export const selectWordStatus = (state: State) => state.book.wordStatus;
export const selectPageNo = (state: State) => state.book.wordStatusToPageNoMap[state.book.wordStatus.toString()];
export const selectWordCount = (state: State) => state.book.wordCount;
export const selectBookId = (state: State) => state.book.bookId;
export const selectBookName = (state: State) => state.book.bookName;
export const selectLastProcessedWord = (state: State): string | undefined => {
  const processedWords = state.book.wordStatusToProcessedWordsMap[state.book.wordStatus.toString()];
  return processedWords.length === 0 ? undefined : processedWords[processedWords.length - 1];
}
