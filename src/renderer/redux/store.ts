import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addReducer } from "../components/add/addSlice";

const store = configureStore({
  reducer: {
    add: addReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
