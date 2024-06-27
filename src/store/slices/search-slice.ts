import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchSlice",
  initialState: {
    searchKey: "",
    filterOptions: [] as string[],
  },
  reducers: {
    setSearchKey(state, action) {
      state.searchKey = action.payload.toUpperCase();
    },
    setFilterKey(state, action) {
      const filterOption = action.payload.toUpperCase();
      if (!state.filterOptions.includes(filterOption)) {
        state.filterOptions = [...state.filterOptions, filterOption];
      } else {
        state.filterOptions = state.filterOptions.filter(
          (data) => data !== filterOption
        );
      }
    },
  },
});

export const { setSearchKey, setFilterKey } = searchSlice.actions;
export default searchSlice.reducer;
