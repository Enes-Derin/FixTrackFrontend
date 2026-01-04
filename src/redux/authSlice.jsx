import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const BASE_URL = axiosInstance.defaults.baseURL;

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${BASE_URL}/login`, data);
            const { accessToken, refreshToken, role } = response.data.payload;

            console.log('Login successful - storing tokens');
            console.log('Access token starts with:', accessToken?.substring(0, 20) + '...');
            console.log('Refresh token starts with:', refreshToken?.substring(0, 10) + '...');
            console.log('Access token length:', accessToken?.length);
            console.log('Refresh token length:', refreshToken?.length);

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", role);

            return response.data.payload;

        } catch (error) {
            return rejectWithValue(error.response.data.exception.message || "Something went wrong");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        localStorage.clear();
        window.location.href = "/login";
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            });

    }
});


export default authSlice.reducer;
