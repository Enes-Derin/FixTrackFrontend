import axios from "axios";
import config from "../config/config";

// axios instance oluştur
const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
});

// request interceptor — her isteğe access token ekler
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

// response interceptor — 401 olduğunda refresh token akışı
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log('API Error:', error.response?.status, error.config?.url);

        // Eğer token expired ise
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Attempting token refresh...');
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.log('No refresh token found');
                // Refresh token yoksa otomatik redirect yapmayalım, çağıran yer hatayı işlesin
                return Promise.reject(error);
            }

            try {
                console.log('Sending refresh request...');
                console.log('Refresh token value:', refreshToken);
                // Yeni access token al - refresh token'ı body'de gönder (backend bekliyor)
                const res = await axios.post(`${config.API_BASE_URL.replace(/\/$/, '')}/refreshToken`, {
                    refreshToken,
                });

                const newAccessToken = res.data.payload.accessToken;
                console.log('Refresh successful, new token received');
                localStorage.setItem("accessToken", newAccessToken);

                // Header’ı güncelle
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // İsteği yeniden gönder
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.log('Refresh failed:', refreshError.response?.status, refreshError.response?.data);
                // Refresh da başarısızsa tokenları temizle ama otomatik redirect yapma
                localStorage.clear();
                // Özel hata mesajı ekle
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
