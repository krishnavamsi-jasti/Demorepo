import { createSlice } from "@reduxjs/toolkit";

const advancedSlice = createSlice({
  name: "advancedSlice",
  initialState: {
    selectedAdvancedRows: [],
  },
  reducers: {
    addSelectedAdvancedRows: (state, action) => {
      state.selectedAdvancedRows = [];
      state.selectedAdvancedRows.push(...action.payload);
    },
  },
});

export const {
  addSelectedAdvancedRows,
} = advancedSlice.actions;

export default advancedSlice.reducer;
