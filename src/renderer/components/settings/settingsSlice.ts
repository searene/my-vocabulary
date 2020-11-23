import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface State {
  settings: SettingsState;
}

interface SettingsState {
  visibility: boolean;
}

const initialState: SettingsState = {
  visibility: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    changeSettingsVisibility: (state, action) => {
      state.visibility = action.payload;
    },
  },
});

export const selectSettingsVisibility = (state: State) =>
  state.settings.visibility;
export const { changeSettingsVisibility } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
