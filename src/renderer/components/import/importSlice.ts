import { createSlice } from "@reduxjs/toolkit";

interface State {
  import: ImportState
}

interface ImportState {
  visibility: boolean;
}

const initialState: ImportState = {
  visibility: false,
}

const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    setImportDialogVisibility: (state, action) => {
      state.visibility = action.payload;
    }
  }
});

export const { setImportDialogVisibility } = importSlice.actions;
export const importReducer = importSlice.reducer;
export const selectImportDialogVisibility = (state: State) => state.import.visibility;
