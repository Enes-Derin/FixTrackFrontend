import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ===================== THUNKS ===================== */

export const getServices = createAsyncThunk(
    "services/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/service-form", {
                headers: getAuthHeader(),
            });
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("Servisler getirilemedi");
        }
    }
);

export const getServiceByCustomerId = createAsyncThunk(
    "services/getByCustomerId",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/service-form/customerId/${id}`,
                { headers: getAuthHeader() }
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("Müşteriye ait servisler getirilemedi");
        }
    }
);

export const deleteService = createAsyncThunk(
    "services/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/service-form/delete/${id}`, {
                headers: getAuthHeader(),
            });
            return id;
        } catch (error) {
            return rejectWithValue("Servis silinemedi");
        }
    }
);

/* ===================== SLICE ===================== */

export const servicesSlice = createSlice({
    name: "services",
    initialState: {
        services: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload || [];
            })
            .addCase(getServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(getServiceByCustomerId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServiceByCustomerId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload || [];
            })
            .addCase(getServiceByCustomerId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter(
                    (s) => s.id !== action.payload
                );
            });
    },
});

export default servicesSlice.reducer;
