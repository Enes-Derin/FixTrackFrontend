import axios from "axios";

// Backend adresin:
const BASE_URL = "http://localhost:8080";

// axios instance oluştur
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// request interceptor — her isteğe access token ekler
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

// response interceptor — 401 olduğunda refresh token akışı
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Eğer token expired ise
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                // Refresh token yoksa logout
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                // Yeni access token al
                const res = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // Header’ı güncelle
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // İsteği yeniden gönder
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh da başarısızsa logout
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
