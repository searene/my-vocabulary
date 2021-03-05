import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface State {
  book: BookState;
}

interface BookState {
  currentWord: string | undefined;
  markedKnownWordIds: number[];
}

const initialState: BookState = {
  currentWord: undefined,
  markedKnownWordIds: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  reducers: {
    setCurrentWord: (state, action) => {
      state.currentWord = action.payload;
    },
    addKnownWordById: (state, action) => {
      state.markedKnownWordIds.push(action.payload);
    },
  },
});

export const { addKnownWordById, setCurrentWord } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
export const selectCurrentWord = (state: State) => state.book.currentWord;
