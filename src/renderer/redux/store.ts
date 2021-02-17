import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addReducer } from "../components/add/addSlice";
import { reviewReducer } from "../components/review/reviewSlice";
import { settingsReducer } from "../components/settings/settingsSlice";
import { browserReducer } from "../components/browser/browserSlice";

const store = configureStore({
  reducer: {
    add: addReducer,
    review: reviewReducer,
    settings: settingsReducer,
    browser: browserReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
