import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./dataSlice";
import advancedSlice from "./advancedSlice";

const store = configureStore({
    reducer : {
        data : dataSlice,
        advancedSlice : advancedSlice
    }
});

export default store;
