import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addReducer } from "../components/add/addSlice";
import { reviewReducer } from "../components/review/reviewSlice";
import { settingsReducer } from "../components/settings/settingsSlice";
import { browserReducer } from "../components/browser/browserSlice";
import { importReducer } from "../components/import/importSlice";
import { shortcutReducer } from "../components/shortcut/shortcutSlice";
import { bookReducer } from "../components/book/bookSlice";

const store = configureStore({
  reducer: {
    add: addReducer,
    review: reviewReducer,
    settings: settingsReducer,
    browser: browserReducer,
    import: importReducer,
    shortcut: shortcutReducer,
    book: bookReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
