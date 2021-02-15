import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";

interface State {
  add: AddState;
}
export interface FieldVO {
  id: number;
  category: string;
  name: string;
  contents: string;
}
interface AddState {
  fieldTypeIdToFieldVOMap: Record<number, FieldVO>; // fieldTypeId -> field contents
}
const initialState: AddState = {
  fieldTypeIdToFieldVOMap: {},
};
export type CreateCardParam = {
  bookId: number;
};

export const getFieldTypes = createAsyncThunk("add/getFieldTypes", async () => {
  return await serviceProvider.cardFacade.getFieldTypes();
});

export const saveCard = createAsyncThunk<
  void,
  { word: string; bookId: number },
  { state: State }
>("add/saveCard", async ({ word, bookId }, { getState }) => {
  const fieldTypeIdToFieldVOMap = selectFieldTypeIdToFieldVOMap(getState());
  const fieldContents: Record<number, string> = {};
  for (const [fieldTypeId, fieldVO] of Object.entries(
    fieldTypeIdToFieldVOMap
  )) {
    fieldContents[parseInt(fieldTypeId)] = fieldVO.contents;
  }
  await serviceProvider.cardFacade.saveCard({
    word,
    bookId,
    fieldContents,
  });
});
const addSlice = createSlice({
  name: "add",
  initialState: initialState,
  reducers: {
    changeFieldContents: (state, action) => {
      const { fieldTypeId, contents } = action.payload;
      state.fieldTypeIdToFieldVOMap[fieldTypeId] = {
        ...state.fieldTypeIdToFieldVOMap[fieldTypeId],
        contents,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFieldTypes.fulfilled, (state, action) => {
      try {
        for (const fieldVO of action.payload) {
          state.fieldTypeIdToFieldVOMap[fieldVO.id] = {
            ...fieldVO,
            contents: "",
          };
        }
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

export const selectFieldTypeIdToFieldVOMap = (state: State) =>
  state.add.fieldTypeIdToFieldVOMap;
export const { changeFieldContents } = addSlice.actions;
export const addReducer = addSlice.reducer;
