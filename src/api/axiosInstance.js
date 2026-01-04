import axios from "axios";
import config from "../config/config";
import { store } from "../redux/store";
import { setAccessToken } from "../redux/authSlice";

const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    `${config.API_BASE_URL.replace(/\/$/, "")}/refreshToken`,
                    { refreshToken }
                );

                const newAccessToken = res.data.payload.accessToken;

                localStorage.setItem("accessToken", newAccessToken);
                store.dispatch(setAccessToken(newAccessToken));

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
