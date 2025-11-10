import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import customersSlice from "../redux/customesSlice";
import serviciesSlice from "../redux/serviceSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customersSlice,
        service: serviciesSlice,
    },
});