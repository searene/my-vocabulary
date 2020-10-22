import { configureStore } from "@reduxjs/toolkit";
import { addReducer } from "../components/add/addSlice";

export default configureStore({
  reducer: {
    add: addReducer,
  },
});
