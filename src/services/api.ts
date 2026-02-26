// src/services/api.ts (if you have one)
import axios from 'axios';
import { getAuthHeaders, handleAuthError } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        try {
            const headers = getAuthHeaders();
            config.headers.Authorization = headers.Authorization;
        } catch (error) {
            // No token, let the request fail with 401
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for 401 handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        handleAuthError(error);
        return Promise.reject(error);
    }
);

export default api;