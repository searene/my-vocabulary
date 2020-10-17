import { CardVO } from "./../../../main/facade/CardFacade";
import { createSlice, createAsyncThunk, Action } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";

interface State {
  add: AddState;
}
interface AddState {
  cardVO: CardVO | undefined;
  fieldContents: Record<number, string>;
}
const initialState: AddState = {
  cardVO: undefined,
  fieldContents: [],
};
export type CreateCardParam = {
  bookId: number;
};
export const createCard = createAsyncThunk<
  CardVO,
  CreateCardParam,
  { state: State }
>("add/createCard", async ({ bookId }, { getState }) => {
  return await serviceProvider.cardFacade.createCard(bookId);
});
export const saveCard = createAsyncThunk<
  void,
  { bookId: number },
  { state: State }
>("add/saveCard", async ({ bookId }, { getState }) => {
  const cardVO = selectCardVO(getState());
  if (cardVO === undefined) {
    throw new Error("cardVO is undefined.");
  }
  const fieldContents = selectFieldContents(getState());
  await serviceProvider.cardFacade.saveCard({
    bookId,
    cardTypeId: cardVO.cardTypeVO.id,
    fieldContents,
  });
});
const addSlice = createSlice({
  name: "add",
  initialState: initialState,
  reducers: {
    changeFieldContents: (state, action) => {
      const { fieldTypeId, contents } = action.payload;
      state.fieldContents[fieldTypeId] = contents;
    },
  },
  extraReducers: builder => {
    builder.addCase(createCard.fulfilled, (state, action) => {
      for (const fieldVO of action.payload.fieldVOs) {
        state.fieldContents[fieldVO.fieldTypeId] = "";
      }
    });
  },
});

export const selectCardVO = (state: State) => state.add.cardVO;
export const selectFieldContents = (state: State) => state.add.fieldContents;
export const { changeFieldContents } = addSlice.actions;
