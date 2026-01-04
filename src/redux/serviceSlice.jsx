import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

/* ===================== THUNKS ===================== */

export const getServices = createAsyncThunk(
    "services/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/service-form");
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("Servisler getirilemedi");
        }
    }
);

export const getServiceById = createAsyncThunk(
    "services/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/service-form/${id}`);
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("Servis bulunamadı");
        }
    }
);

export const getServiceByCustomerId = createAsyncThunk(
    "services/getByCustomerId",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/service-form/customerId/${id}`
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("Müşteriye ait servisler getirilemedi");
        }
    }
);

export const addService = createAsyncThunk(
    "services/add",
    async (service, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/service-form", service);
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("Servis eklenemedi");
        }
    }
);

export const deleteService = createAsyncThunk(
    "services/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/service-form/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue("Servis silinemedi");
        }
    }
);

export const updateServiceSignature = createAsyncThunk(
    "services/updateSignature",
    async ({ id, customerSignature, technicianSignature }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/service-form/${id}/signatures`,
                { customerSignature, technicianSignature }
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue("İmzalar güncellenemedi");
        }
    }
);

/* ===================== SLICE ===================== */

const servicesSlice = createSlice({
    name: "services",
    initialState: {
        services: [],
        service: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload || [];
            })
            .addCase(getServiceByCustomerId.fulfilled, (state, action) => {
                state.services = action.payload || [];
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.services.push(action.payload);
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter(
                    (s) => s.id !== action.payload
                );
            });
    },
});

export default servicesSlice.reducer;
