import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slices/app-slice";
import searchSlice from "./slices/search-slice";

export interface MyStore {
  app: {
    isHalfsheetOpen: boolean;
    isEditOption: boolean;
  };
  search: {
    searchKey: string;
    filterOptions: string[];
  };
}

const store = configureStore({
  reducer: {
    app: appSlice,
    search: searchSlice,
  },
});

export default store;
