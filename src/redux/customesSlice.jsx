import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getCustomers = createAsyncThunk(
    "customers",
    async () => {
        try {
            const response = await axiosInstance.get("/customer",
                {
                    headers: getAuthHeader()
                });
            console.log(response.data.payload)
            return response.data.payload;
        } catch (error) {
            console.log(error.response?.data?.exception?.message || error.message);
            throw error;
        }
    }
);

export const getCustomer = createAsyncThunk(
    "customer",
    async (id) => {
        try {
            const response = await axiosInstance.get(`/customer/${id}`,
                {
                    headers: getAuthHeader()
                }
            );
            console.log(response.data.payload)
            return response.data.payload;
        } catch (error) {
            console.log(error.response?.data?.exception?.message || error.message);
            throw error;
        }
    }
);

export const createCustomer = createAsyncThunk(
    "createCustomer",
    async (customer) => {
        try {
            const response = await axiosInstance.post(`/customer`, customer,
                {
                    headers: getAuthHeader()
                });
            console.log(response.data.payload)
            return response.data.payload;
        } catch (error) {
            console.log(error.response?.data?.exception?.message || error.message);
            throw error;
        }
    }
);

export const updateCustomer = createAsyncThunk(
    "updateCustomer",
    async (customer) => {
        try {
            const response = await axiosInstance.put(`/customer/update/${customer.id}`, customer,
                {
                    headers: getAuthHeader()
                });
            console.log(response.data.payload)
            return response.data.payload;
        } catch (error) {
            console.log(error.response?.data?.exception?.message || error.message);
            throw error;
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    "deleteCustomer",
    async (id) => {
        try {
            const response = await axiosInstance.delete(`/customer/delete/${id}`,
                {
                    headers: getAuthHeader()
                });
            console.log(response.data.payload)
            return response.data.payload;
        } catch (error) {
            console.log(error.response?.data?.exception?.message || error.message);
            throw error;
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
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = action.payload;
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getCustomer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCustomer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customer = action.payload;
            })
            .addCase(getCustomer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createCustomer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = [...state.customers, action.payload];
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateCustomer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = state.customers.map((customer) =>
                    customer.id === action.payload.id
                        ? action.payload
                        : customer
                );
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = state.customers.filter(
                    (customer) => customer.id !== action.payload
                );
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});
export const { addCasers, removeCustomer } = customersSlice.actions;
export default customersSlice.reducer;