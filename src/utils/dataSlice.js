import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    categoryData: [],
    classData: [],
    departmentData: [],
    productsData: [],
    gridDataState: [],
    budgetAccountState: [],
    shippingAddresses: [],
  },
  reducers: {
    addCategoryData: (state, action) => {
      state.categoryData = [];
      state.categoryData.push(...action.payload);
    },
    addClassesData: (state, action) => {
      state.classData = [];
      state.classData.push(...action.payload);
    },
    addDepartmentsData: (state, action) => {
      state.departmentData = [];
      state.departmentData.push(...action.payload);
    },
    addProductsData: (state, action) => {
      state.productsData = [];
      state.productsData.push(...action.payload);
    },
    addGridDataState: (state, action) => {
      state.gridDataState = [];
      state.gridDataState.push(...action.payload);
    },
    addBudgetAccountStore: (state, action) => {
      state.budgetAccountState = [];
      state.budgetAccountState.push(...action.payload);
    },
    addShippingAddresses: (state, action) => {
      state.shippingAddresses = [];
      state.shippingAddresses.push(...action.payload);
    }
  },
});

export const {
  addCategoryData,
  addClassesData,
  addDepartmentsData,
  addProductsData,
  addGridDataState,
  addBudgetAccountStore,
  addShippingAddresses
} = dataSlice.actions;

export default dataSlice.reducer;
