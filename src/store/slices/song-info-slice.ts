import { createSlice } from "@reduxjs/toolkit";

const songInfoSlice = createSlice({
  name: "songInfoSlice",
  initialState: {
    songInformation: [],
  },
  reducers: {
    setSongInfo(state, action) {
      state.songInformation = action.payload;
    },
  },
});

export const { setSongInfo } = songInfoSlice.actions;
export default songInfoSlice.reducer;
