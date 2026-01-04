import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate;
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
        navigate("/login");
    }
);

const initialState = {
    user: null,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    isLoading: false,
    error: null,
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
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            });
    },
});

export default authSlice.reducer;
