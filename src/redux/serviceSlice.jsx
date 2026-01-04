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
            return rejectWithValue(
                error.response?.data || "Servisler getirilemedi"
            );
        }
    }
);

export const getServiceById = createAsyncThunk(
    "services/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/service-form/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Servis bulunamadı"
            );
        }
    }
);

export const getServiceByCustomerId = createAsyncThunk(
    "services/getByCustomerId",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/service-form/customerId/${id}`,
                {
                    headers: getAuthHeader(),
                }
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Müşteriye ait servisler getirilemedi"
            );
        }
    }
);

export const addService = createAsyncThunk(
    "services/add",
    async (service, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/service-form",
                service,
                {
                    headers: getAuthHeader(),
                }
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Servis eklenemedi"
            );
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
            return id; // 🔴 backend bağımsız, güvenli
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Servis silinemedi"
            );
        }
    }
);

export const updateServiceSignature = createAsyncThunk(
    "services/updateSignature",
    async (
        { id, customerSignature, technicianSignature },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.put(
                `/service-form/${id}/signatures`,
                {
                    customerSignature: customerSignature || null,
                    technicianSignature: technicianSignature || null,
                },
                {
                    headers: getAuthHeader(),
                }
            );
            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "İmzalar güncellenemedi"
            );
        }
    }
);

/* ===================== SLICE ===================== */

export const servicesSlice = createSlice({
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

            /* GET ALL */
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

            /* GET BY ID */
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
                state.error = action.payload;
            })

            /* GET BY CUSTOMER */
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

            /* ADD */
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
                state.error = action.payload;
            })

            /* DELETE */
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = state.services.filter(
                    (service) => service.id !== action.payload
                );
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            /* UPDATE SIGNATURE */
            .addCase(updateServiceSignature.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateServiceSignature.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedService = action.payload;

                if (
                    state.service &&
                    state.service.id === updatedService.id
                ) {
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
                state.error = action.payload;
            });
    },
});

export default servicesSlice.reducer;
