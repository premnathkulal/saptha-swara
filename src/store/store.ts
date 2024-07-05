import { configureStore } from "@reduxjs/toolkit";
import { SongInfo } from "../hooks/api-hook/useSongInfo";
import appSlice from "./slices/app-slice";
import searchSlice from "./slices/search-slice";
import songInfoSlice from "./slices/song-info-slice";

export interface MyStore {
  app: {
    isAddEditOptionEnabled: boolean;
    isEditOption: boolean;
    showToastMessage: boolean;
    toastMessage: string;
    editInfo: SongInfo;
    showSearchFilter: boolean;
  };
  search: {
    searchKey: string;
    filterOptions: string[];
  };
  songInfo: {
    songInformation: SongInfo[];
  };
}

const store = configureStore({
  reducer: {
    app: appSlice,
    search: searchSlice,
    songInfo: songInfoSlice,
  },
});

export default store;
