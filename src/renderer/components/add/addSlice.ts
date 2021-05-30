import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";
import { FieldContents } from "../../../main/domain/card/FieldContents";
import { FieldVO } from "../../../main/facade/vo/FieldVO";

interface State {
  add: AddState;
}
interface AddState {
  fieldTypeIdToFieldVOMap: Record<number, FieldVO>; // fieldTypeId -> field contents
}
const initialState: AddState = {
  fieldTypeIdToFieldVOMap: {},
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
  const fieldContents: Record<number, FieldContents> = {};
  for (const [fieldTypeId, fieldVO] of Object.entries(fieldTypeIdToFieldVOMap)) {
    fieldContents[parseInt(fieldTypeId)] = {
      originalContents: fieldVO.originalContents,
      plainTextContents: fieldVO.plainTextContents,
    };
  }
  await serviceProvider.cardFacade.saveCard({
    word,
    bookId,
    fieldContents,
  });
});

export const fetchFieldTypeIdToFieldVOMap = createAsyncThunk<
  Record<number, FieldVO>,
  { cardInstanceId: number },
  { state: State }
>("add/fetchFieldTypeIdToFieldVOMap", async ({ cardInstanceId }) => {
  return await serviceProvider.cardFacade.getFieldTypeIdToFieldVOMap(cardInstanceId);
})
const addSlice = createSlice({
  name: "add",
  initialState: initialState,
  reducers: {
    changeFieldContents: (state, action) => {
      const { fieldTypeId, originalContents, plainTextContents } = action.payload;
      state.fieldTypeIdToFieldVOMap[fieldTypeId] = {
        ...state.fieldTypeIdToFieldVOMap[fieldTypeId],
        originalContents,
        plainTextContents,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFieldTypes.fulfilled, (state, action) => {
      try {
        for (const fieldVO of action.payload) {
          state.fieldTypeIdToFieldVOMap[fieldVO.id] = {
            fieldTypeId: fieldVO.id,
            name: fieldVO.name,
            category: fieldVO.category,
            originalContents: "",
            plainTextContents: "",
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
    builder.addCase(fetchFieldTypeIdToFieldVOMap.fulfilled, (state, action) => {
      console.log(action.payload);
      state.fieldTypeIdToFieldVOMap = action.payload;
    });
    builder.addCase(fetchFieldTypeIdToFieldVOMap.rejected, (state, action) => {
      console.error("fetchFieldTypeIdToFieldVOMap was rejected");
      console.error(action.error);
    })
  },
});

export const selectFieldTypeIdToFieldVOMap = (state: State) =>
  state.add.fieldTypeIdToFieldVOMap;
export const { changeFieldContents } = addSlice.actions;
export const addReducer = addSlice.reducer;
