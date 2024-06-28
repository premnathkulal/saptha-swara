import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isAddEditOptionEnabled: false,
    isEditOption: false,
  },
  reducers: {
    closeAddEditOption(state) {
      document.body.style.overflow = "unset";
      state.isAddEditOptionEnabled = false;
    },
    openAddEditOption(state) {
      document.body.style.overflow = "hidden";
      state.isAddEditOptionEnabled = true;
    },
    setIsEditOption(state, action) {
      state.isEditOption = action.payload;
    },
  },
});

export const { closeAddEditOption, openAddEditOption, setIsEditOption } =
  appSlice.actions;
export default appSlice.reducer;
