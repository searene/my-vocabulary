import { CardVO } from "./../../../main/facade/CardFacade";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";
import { WebContents } from "electron";

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

export const getFieldTypes = createAsyncThunk("add/getFieldTypes", async () => {
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
      try {
        for (const fieldVO of action.payload) {
          state.fieldContents[fieldVO.id] = "";
        }
        console.log(state);
      } catch (err) {
        console.error("Error occurred in getFieldTypes.fulfilled.");
        console.error(err);
      }
    });
    builder.addCase(getFieldTypes.rejected, (state, action) => {
      console.error("getFieldTypes.rejected: an error occurred");
      console.error(action.error);
    });
  },
});

export const selectCardVO = (state: State) => state.add.cardVO;
export const selectFieldContents = (state: State) => state.add.fieldContents;
export const { changeFieldContents } = addSlice.actions;
export const addReducer = addSlice.reducer;
