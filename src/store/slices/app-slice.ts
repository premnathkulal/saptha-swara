import { createSlice } from "@reduxjs/toolkit";

export interface VideoPlayerState {
  videoId: string | null;
  title: string;
  raga: string;
  tala: string;
  type: string;
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    isAddEditOptionEnabled: false,
    isEditOption: false,
    showToastMessage: false,
    toastMessage: "",
    editInfo: null,
    showSearchFilter: false,
    videoPlayer: { videoId: null, title: "", raga: "", tala: "", type: "" } as VideoPlayerState,
    authUser: null as AuthUser | null,
  },
  reducers: {
    closeAddEditOption(state) {
      document.body.style.overflow = "unset";
      state.isAddEditOptionEnabled = false;
    },
    openAddEditOption(state, action) {
      document.body.style.overflow = "hidden";
      state.isAddEditOptionEnabled = true;
      state.isEditOption = !!action.payload;
      if (action.payload) {
        state.editInfo = action.payload;
      } else {
        state.editInfo = null;
      }
    },
    setIsEditOption(state, action) {
      state.isEditOption = action.payload;
    },
    showToastMessage(state, action) {
      state.showToastMessage = true;
      state.toastMessage = action.payload;
    },
    hideToastMessage(state) {
      state.showToastMessage = false;
    },
    setShowSearchFilter(state) {
      state.showSearchFilter = true;
    },
    hideSearchFilter(state) {
      state.showSearchFilter = false;
    },
    openVideoPlayer(state, action) {
      document.body.style.overflow = "hidden";
      state.videoPlayer = action.payload;
    },
    closeVideoPlayer(state) {
      document.body.style.overflow = "";
      state.videoPlayer = { videoId: null, title: "", raga: "", tala: "", type: "" };
    },
    setAuthUser(state, action) {
      state.authUser = action.payload;
    },
    clearAuthUser(state) {
      state.authUser = null;
    },
  },
});

export const {
  closeAddEditOption,
  openAddEditOption,
  setIsEditOption,
  showToastMessage,
  hideToastMessage,
  setShowSearchFilter,
  hideSearchFilter,
  openVideoPlayer,
  closeVideoPlayer,
  setAuthUser,
  clearAuthUser,
} = appSlice.actions;
export default appSlice.reducer;
