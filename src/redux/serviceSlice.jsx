import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getServices = createAsyncThunk(
    "getServices",
    async () => {
        try {
            const response = await axiosInstance.get("/service-form", {
                headers: getAuthHeader(),
            });
            return response.data.payload;
        } catch (error) {
            throw error;
        }
    }
);

export const getServiceById = createAsyncThunk(
    "getServiceById",
    async (id) => {
        try {
            const response = await axiosInstance.get(`/service-form/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data.payload;
        } catch (error) {
            throw error;
        }
    }
);

export const getServiceByCustomerId = createAsyncThunk(
    "getServiceByCustomerId",
    async (id) => {
        try {
            const response = await axiosInstance.get(
                `/service-form/customerId/${id}`,
                {
                    headers: getAuthHeader(),
                }
            );
            return response.data.payload;
        } catch (error) {
            throw error;
        }
    }
);

export const addService = createAsyncThunk(
    "addService",
    async (service) => {
        try {
            const response = await axiosInstance.post("/service-form", service, {
                headers: getAuthHeader(),
            });
            return response.data.payload;
        } catch (error) {
            throw error;
        }
    }
);

export const deleteService = createAsyncThunk(
    "deleteService",
    async (id) => {
        try {
            const response = await axiosInstance.delete(`/service-form/delete/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data.payload;
        } catch (error) {
            throw error;
        }
    }
);


export const serviciesSlice = createSlice({
    name: "services",
    initialState: {
        services: [],
        service: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServices.fulfilled, (state, action) => {
                state.services = action.payload;
            })
            .addCase(getServiceById.fulfilled, (state, action) => {
                state.service = action.payload;
            })
            .addCase(getServiceByCustomerId.fulfilled, (state, action) => {
                state.services = action.payload;
            })

            .addCase(addService.fulfilled, (state, action) => {
                state.services.push(action.payload);
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter(
                    (service) => service.id !== action.payload.id
                );
            });
    },
});

export default serviciesSlice.reducer;