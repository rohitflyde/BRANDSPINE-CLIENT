// src/services/auth.service.ts
import api from './api';
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    ApiError
} from '../types';
import { AxiosError } from 'axios';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const { data } = await api.post<AuthResponse>('/auth/signin', credentials);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Login failed' };
        }
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const { data } = await api.post<AuthResponse>('/auth/signup', credentials);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Registration failed' };
        }
    },

    async getCurrentUser(): Promise<AuthResponse> {
        try {
            const { data } = await api.get<AuthResponse>('/auth/me');
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Failed to get user' };
        }
    },

    logout(): void {
        localStorage.removeItem('token');
    }
};