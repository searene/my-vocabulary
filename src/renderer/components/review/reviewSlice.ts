import { CardVO } from "../../../main/facade/CardFacade";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";

interface State {
  review: ReviewState;
}

interface ReviewState {
  reviewCard: CardVO | undefined;
}
const initialState: ReviewState = {
  reviewCard: undefined,
};

export const getNextReviewCard = createAsyncThunk<
  CardVO | undefined,
  { bookId: number },
  { state: State }
>("review/getNextReviewCard", async ({ bookId }) => {
  return await serviceProvider.cardFacade.getNextReviewCardByBookId(bookId);
});

const reviewSlice = createSlice({
  name: "review",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNextReviewCard.fulfilled, (state, action) => {
      state.reviewCard = action.payload;
    });
  },
});

export const selectReviewCard = (state: State) => state.review.reviewCard;

export const reviewReducer = reviewSlice.reducer;
