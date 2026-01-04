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

            return { accessToken, refreshToken, role, user };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.exception?.message || "Giriş yapılamadı"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        localStorage.clear();
        return true;
    }
);

const initialState = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    isAuthenticated: !!localStorage.getItem("accessToken"),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
