import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";
import { BrowseData } from "../../../main/facade/CardFacade";

interface State {
  browser: BrowserState;
}

interface BrowserState {
  visibility: boolean;
  browseData: BrowseData;
}

const initialState: BrowserState = {
  visibility: false,
  browseData: { reviewItems: [], totalCount: 0 },
};


export const getBrowseData = createAsyncThunk<
  BrowseData,
  { offset: number; limit: number },
  { state: State }
  >("browser/getBrowseData", async ({ offset, limit }) => {
  return await serviceProvider.cardFacade.getBrowseData(offset, limit);
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
      state.browseData.reviewItems = action.payload.reviewItems;
      state.browseData.totalCount = action.payload.totalCount;
    });
    builder.addCase(getBrowseData.rejected, (state, action) => {
      console.error("getBrowseData.rejected: an error occurred");
      console.error(action.error);
    });
  }
});

export const selectBrowserVisibility = (state: State) => state.browser.visibility;
export const { setBrowserVisibility } = browserSlice.actions;
export const selectBrowseData = (state: State) => state.browser.browseData;
export const browserReducer = browserSlice.reducer;