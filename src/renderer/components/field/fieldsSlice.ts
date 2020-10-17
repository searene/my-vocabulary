import { Card } from "./../../../main/domain/card/Card";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
interface ChangeContentsPayload {
  id: number;
  contents: string;
}
interface FieldDO {
  id: number;
  contents: string;
}
interface FieldsState {
  fieldDOs: Record<number, FieldDO>;
}
interface SaveCardParam {
  card: Card;
  fields: FieldDO[];
}
const fieldsSelector = (state: FieldsState): Record<number, FieldDO> =>
  state.fieldDOs;
export const saveCard = createAsyncThunk<
  void,
  SaveCardParam,
  { state: FieldsState }
>("fields/saveFields", async (param: SaveCardParam, thunkAPI) => {
  const fields: Field[] = param.card.fields;
  const getState: () => FieldsState = thunkAPI.getState;
  const fieldDOs = fieldsSelector(getState());
  for (const field of fields) {
    field.contents = fieldDOs[field.id].contents;
  }
  param.card.save();
});
export const fieldsSlice = createSlice({
  name: "fields",
  initialState: {
    fieldDOs: {},
  },
  reducers: {
    changeContents: (
      state: Record<number, FieldDO>,
      action: PayloadAction<ChangeContentsPayload>
    ) => {
      state[action.payload.id].contents = action.payload.contents;
    },
    create: (
      state: Record<number, FieldDO>,
      action: PayloadAction<FieldDO[]>
    ) => {
      const fields: Record<number, FieldDO> = {};
      for (const field of action.payload) {
        fields[field.id] = field;
      }
      state = fields;
    },
  },
  extraReducers: builder => {
    builder.addCase(saveCard.fulfilled, (state, action) => {
      state.fieldDOs = {};
    });
  },
});
