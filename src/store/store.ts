import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slices/app-slice";

export interface MyStore {
  app: {
    isHalfsheetOpen: boolean;
    isEditOption: boolean;
  };
}

const store = configureStore({
  reducer: {
    app: appSlice,
  },
});

export default store;
