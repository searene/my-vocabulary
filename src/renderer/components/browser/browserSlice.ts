import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";
import { BrowseData } from "../../../main/facade/CardFacade";

interface State {
  browser: BrowserState;
}

interface BrowserState {
  visibility: boolean;
  browseDataList: BrowseData[];
}

const initialState: BrowserState = {
  visibility: false,
  browseDataList: [],
};


export const getBrowseData = createAsyncThunk<
  BrowseData[],
  { offset: number; limit: number },
  { state: State }
  >("browser/getBrowseDataList", async ({ offset, limit }) => {
  return await serviceProvider.cardFacade.getBrowseDataList(offset, limit);
});

const browserSlice = createSlice({
  name: "browser",
  initialState: initialState,
  reducers: {
    setBrowserVisibility: (state, action) => {
      state.visibility = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBrowseData.fulfilled, (state, action) => {
      state.browseDataList = action.payload;
    });
    builder.addCase(getBrowseData.rejected, (state, action) => {
      console.error("getBrowseDataList.rejected: an error occurred");
      console.error(action.error);
    });
  }
});

export const selectBrowserVisibility = (state: State) => state.browser.visibility;
export const { setBrowserVisibility } = browserSlice.actions;
export const selectBrowseData = (state: State) => state.browser.browseDataList;
export const browserReducer = browserSlice.reducer;