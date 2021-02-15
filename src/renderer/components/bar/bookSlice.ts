import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface BookState {
  markedKnownWordIds: number[];
}

const initialState: BookState = {
  markedKnownWordIds: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  reducers: {
    addKnownWordById: (state, action) => {
      state.markedKnownWordIds.push(action.payload);
    },
  },
});

export const { addKnownWordById } = bookSlice.actions;
export const bookReducer = bookSlice.reducer;
