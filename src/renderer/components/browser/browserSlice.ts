import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface State {
  browser: BrowserState;
}

interface BrowserState {
  visibility: boolean;
}

const initialState: BrowserState = {
  visibility: false,
};

const browserSlice = createSlice({
  name: "browser",
  initialState: initialState,
  reducers: {
    setBrowserVisibility: (state, action) => {
      state.visibility = action.payload;
    },
  },
});

export const selectBrowserVisibility = (state: State) =>
  state.browser.visibility;
export const { setBrowserVisibility } = browserSlice.actions;
export const settingsReducer = browserSlice.reducer;