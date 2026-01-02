// Authentication utility functions
export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
};

export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};