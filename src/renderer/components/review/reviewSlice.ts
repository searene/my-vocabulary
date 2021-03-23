import { CardInstanceVO } from "../../../main/facade/CardFacade";
import { createSlice } from "@reduxjs/toolkit";

interface State {
  review: ReviewState;
}

interface ReviewState {
  reviewCard: CardInstanceVO | undefined;
}
const initialState: ReviewState = {
  reviewCard: undefined,
};

const reviewSlice = createSlice({
  name: "review",
  initialState: initialState,
  reducers: {},
});

export const selectReviewCard = (state: State) => state.review.reviewCard;

export const reviewReducer = reviewSlice.reducer;
