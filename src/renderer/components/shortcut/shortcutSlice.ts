import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface State {
  shortcut: ShortcutState;
}

interface ShortcutState {
  globalShortcutEnabled: boolean;
}

const initialState: ShortcutState = {
  globalShortcutEnabled: true,
};

const shortcutSlice = createSlice({
  name: "shortcut",
  initialState: initialState,
  reducers: {
    enableGlobalShortcut: (state) => {
      state.globalShortcutEnabled = true;
    },
    disableGlobalShortcut: (state) => {
      state.globalShortcutEnabled = false;
    },
  },
});

export const { enableGlobalShortcut, disableGlobalShortcut } = shortcutSlice.actions;
export const shortcutReducer = shortcutSlice.reducer;
export const selectGlobalShortcutEnabled = (state: State) =>
  state.shortcut.globalShortcutEnabled;
