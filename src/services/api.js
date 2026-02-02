import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ========================================
// AUTH API
// ========================================

export const authAPI = {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    getProfile: () => api.get('/users/profile'),
};

// ========================================
// DROPS API
// ========================================

export const dropsAPI = {
    getAll: (params) => api.get('/drops', { params }),
    getById: (id) => api.get(`/drops/${id}`),
    create: (data) => api.post('/drops', data),
    update: (id, data) => api.put(`/drops/${id}`, data),
    delete: (id) => api.delete(`/drops/${id}`),
    getStats: (id) => api.get(`/drops/${id}/stats`),
};

// ========================================
// RESERVATIONS API
// ========================================

export const reservationsAPI = {
    reserve: (dropId) => api.post('/reservations', { dropId }),
    getUserReservations: (status) => api.get('/reservations/user', { params: { status } }),
    getById: (id) => api.get(`/reservations/${id}`),
    cancel: (id) => api.delete(`/reservations/${id}`),
};

// ========================================
// PURCHASES API
// ========================================

export const purchasesAPI = {
    complete: (reservationId) => api.post('/purchases', { reservationId }),
    getUserPurchases: (params) => api.get('/purchases/user', { params }),
    getDropPurchases: (dropId, limit = 3) => api.get(`/purchases/drop/${dropId}`, { params: { limit } }),
};

export default api;