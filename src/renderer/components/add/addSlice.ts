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

export const getFieldTypes = createAsyncThunk("add/createCard", async () => {
  return await serviceProvider.cardFacade.getFieldTypes();
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
  await serviceProvider.cardFacade.createCard({
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
    builder.addCase(getFieldTypes.fulfilled, (state, action) => {
      for (const fieldVO of action.payload) {
        state.fieldContents[fieldVO.id] = "";
      }
    });
  },
});

export const selectCardVO = (state: State) => state.add.cardVO;
export const selectFieldContents = (state: State) => state.add.fieldContents;
export const { changeFieldContents } = addSlice.actions;
export const addReducer = addSlice.reducer;
