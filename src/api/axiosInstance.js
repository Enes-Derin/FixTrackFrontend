import axios from "axios";
import config from "../config/config";

const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        console.log('Request interceptor - Token exists:', !!token, 'URL:', config.url);
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

        console.log('API Error:', error.response?.status, error.config?.url);
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Attempting token refresh...');
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.log('No refresh token found');
                return Promise.reject(error);
            }

            try {
                console.log('Sending refresh request...');
                console.log('Refresh token value:', refreshToken);
                const res = await axios.post(`${config.API_BASE_URL.replace(/\/$/, '')}/refreshToken`, {
                    refreshToken,
                });

                const newAccessToken = res.data.payload.accessToken;
                console.log('Refresh successful, new token received');
                localStorage.setItem("accessToken", newAccessToken);


                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.log('Refresh failed:', refreshError.response?.status, refreshError.response?.data);

                localStorage.clear();

                const authError = new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
                authError.status = 401;
                authError.isAuthError = true;
                return Promise.reject(authError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
