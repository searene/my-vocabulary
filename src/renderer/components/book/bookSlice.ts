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

interface StringToNumberArrayType {
  [index: string]: number[];
}

interface BookState {
  word: string;
  wordId: number | undefined;
  wordStatus: WordStatus;
  wordStatusToPageNoMap: StringToNumberType;
  wordStatusToProcessedWordIdsMap: StringToNumberArrayType;
  originalWord: string;
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

const initWordStatusToProcessedWordIdsMap = (): StringToNumberArrayType => {
  const result: StringToNumberArrayType = {};
  for (const wordStatus in WordStatus) {
    if (!isNaN(Number(wordStatus))) {
      result[wordStatus.toString()] = [];
    }
  }
  return result;
}

const initialState: BookState = {
  word: "",
  wordId: undefined,
  wordStatus: WordStatus.UNKNOWN,
  wordStatusToPageNoMap: initWordStatusToPageNoMap(),
  wordStatusToProcessedWordIdsMap: initWordStatusToProcessedWordIdsMap(),
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
  void,
  { state: State }
>("book/refreshBookName", async (_, { getState }) => {
  const bookVO = await serviceProvider.bookService.getBook(getState().book.bookId as number);
  return {
    bookName: bookVO.name
  };
});

export const retrieveWord = createAsyncThunk<
  { wordId: number | undefined, word: string, originalWord: string, contextList: WordContext[], wordCount: WordCount},
  void,
  {state: State}
>("book/retrieveWord", async (_, {getState}) => {
  const pageNo = getState().book.wordStatusToPageNoMap[getState().book.wordStatus];
  const wordVO = await getCurrentWord(getState().book.bookId as number, pageNo, getState().book.wordStatus);
  const wordCount = await serviceProvider.wordService.getWordCount(getState().book.bookId as number);
  return {
    wordId: wordVO?.id,
    word: wordVO === undefined ? "" : wordVO.word,
    originalWord: wordVO === undefined ? "" : wordVO.originalWord,
    contextList: wordVO === undefined ? [] : wordVO.contextList,
    wordCount: wordCount,
  }
});

export const searchWord = createAsyncThunk<
  {wordId: number, word: string, originalWord: string, contextList: WordContext[]},
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
    wordId: wordVO.id,
    word: wordVO.word,
    originalWord: wordVO.originalWord,
    contextList: wordVO.contextList
  }
})

const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  reducers: {
    setWord: (state, action) => {
      state.word = action.payload;
    },
    setWordId: (state, action) => {
      state.wordId = action.payload;
    },
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
      state.wordStatusToProcessedWordIdsMap[state.wordStatus.toString()].push(state.wordId as number);
    },
    removeLastProcessedWord: (state) => {
      state.wordStatusToProcessedWordIdsMap[state.wordStatus.toString()].pop();
    }
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveWord.fulfilled, (state, action) => {
      state.wordId = action.payload.wordId;
      state.word = action.payload.word;
      state.originalWord = action.payload.originalWord;
      state.contextList = action.payload.contextList;
      state.wordCount = action.payload.wordCount;
    });
    builder.addCase(retrieveWord.rejected, (state, action) => {
      console.error("Error in retrieveWord");
      console.error(action.error);
    });
    builder.addCase(searchWord.fulfilled, (state, action) => {
      state.wordId = action.payload.wordId;
      state.word = action.payload.word;
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

export const { markCurrentWordAsProcessed, setWord, setWordId, setBookId, setWordStatus, setPageNo, removeLastProcessedWord } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
export const selectWord = (state: State) => state.book.word;
export const selectOriginalWord = (state: State) => state.book.originalWord;
export const selectContextList = (state: State) => state.book.contextList;
export const selectWordId = (state: State) => state.book.wordId;
export const selectWordStatus = (state: State) => state.book.wordStatus;
export const selectPageNo = (state: State) => state.book.wordStatusToPageNoMap[state.book.wordStatus.toString()];
export const selectWordCount = (state: State) => state.book.wordCount;
export const selectBookId = (state: State) => state.book.bookId;
export const selectBookName = (state: State) => state.book.bookName;
export const selectLastProcessedWordId = (state: State): number | undefined => {
  const processedWordIds = state.book.wordStatusToProcessedWordIdsMap[state.book.wordStatus.toString()];
  return processedWordIds.length === 0 ? undefined : processedWordIds[processedWordIds.length - 1];
}
