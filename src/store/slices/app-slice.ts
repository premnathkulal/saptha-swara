import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isAddEditOptionEnabled: false,
    isEditOption: false,
    showToastMessage: false,
    toastMessage: "",
    editInfo: null,
    showSearchFilter: false,
  },
  reducers: {
    closeAddEditOption(state) {
      document.body.style.overflow = "unset";
      state.isAddEditOptionEnabled = false;
    },
    openAddEditOption(state, action) {
      document.body.style.overflow = "hidden";
      state.isAddEditOptionEnabled = true;
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
} = appSlice.actions;
export default appSlice.reducer;
