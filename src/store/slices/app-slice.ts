import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isHalfsheetOpen: false,
    isEditOption: false,
  },
  reducers: {
    closeHalfSheet(state) {
      document.body.style.overflow = "unset";
      state.isHalfsheetOpen = false;
    },
    openHalfSheet(state) {
      document.body.style.overflow = "hidden";
      state.isHalfsheetOpen = true;
    },
    setIsEditOption(state, action) {
      state.isEditOption = action.payload;
    },
  },
});

export const { closeHalfSheet, openHalfSheet, setIsEditOption } =
  appSlice.actions;
export default appSlice.reducer;
