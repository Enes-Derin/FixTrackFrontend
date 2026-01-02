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

export const updateServiceSignature = createAsyncThunk(
    "updateServiceSignature",
    async ({ id, customerSignature, technicianSignature }) => {
        try {
            const response = await axiosInstance.put(
                `/service-form/${id}/signatures`,
                {
                    customerSignature: customerSignature || null,
                    technicianSignature: technicianSignature || null
                },
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


export const serviciesSlice = createSlice({
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
                state.error = null;
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload;
            })
            .addCase(getServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getServiceById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServiceById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.service = action.payload;
            })
            .addCase(getServiceById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getServiceByCustomerId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServiceByCustomerId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload;
            })
            .addCase(getServiceByCustomerId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(addService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services.push(action.payload);
            })
            .addCase(addService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = state.services.filter(
                    (service) => service.id !== action.payload.id
                );
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateServiceSignature.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateServiceSignature.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedService = action.payload;
                if (state.service && state.service.id === updatedService.id) {
                    state.service = updatedService;
                }
                const index = state.services.findIndex(
                    (s) => s.id === updatedService.id
                );
                if (index !== -1) {
                    state.services[index] = updatedService;
                }
            })
            .addCase(updateServiceSignature.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default serviciesSlice.reducer;