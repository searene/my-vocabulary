import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { WordVO } from "../../../main/database/WordVO";

interface State {
  book: BookState;
}

interface BookState {
  currentWord: string;
  markedKnownWordIds: number[];
}

const initialState: BookState = {
  currentWord: "",
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
