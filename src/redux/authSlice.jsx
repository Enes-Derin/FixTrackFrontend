import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/login", data);

            const { accessToken, refreshToken, role, user } = response.data.payload;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", role);
            localStorage.setItem("user", JSON.stringify(user));

            return response.data.payload;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.exception?.message || "Giriş başarısız"
            );
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
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
