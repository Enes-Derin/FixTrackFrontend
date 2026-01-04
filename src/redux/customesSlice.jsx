import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getCustomers = createAsyncThunk(
    "customers/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/customer");
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.exception?.message || "Müşteriler getirilemedi"
            );
        }
    }
);

export const getCustomer = createAsyncThunk(
    "customers/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/customer/${id}`);
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.exception?.message || "Müşteri bulunamadı"
            );
        }
    }
);

export const createCustomer = createAsyncThunk(
    "customers/create",
    async (customer, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/customer", customer);
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.exception?.message || "Müşteri oluşturulamadı"
            );
        }
    }
);

export const updateCustomer = createAsyncThunk(
    "customers/update",
    async (customer, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/customer/update/${customer.id}`,
                customer
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.exception?.message || "Müşteri güncellenemedi"
            );
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    "customers/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/customer/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.exception?.message || "Müşteri silinemedi"
            );
        }
    }
);

const initialState = {
    customers: [],
    customer: null,
    isLoading: false,
    error: null,
};

const customersSlice = createSlice({
    name: "customers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = action.payload || [];
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(getCustomer.fulfilled, (state, action) => {
                state.customer = action.payload;
            })

            .addCase(createCustomer.fulfilled, (state, action) => {
                state.customers.push(action.payload);
            })

            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.map((c) =>
                    c.id === action.payload.id ? action.payload : c
                );
            })

            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(
                    (c) => c.id !== action.payload
                );
            });
    },
});

export default customersSlice.reducer;
