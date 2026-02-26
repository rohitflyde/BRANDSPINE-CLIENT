// src/services/brand.service.ts
import { api } from './api';
import type { ActiveBrandResponse, BrandConfig, ApiError } from '../types';
import { AxiosError } from 'axios';

export const brandService = {
    async getActiveBrand(): Promise<ActiveBrandResponse> {
        try {
            // Make sure this matches your backend route
            const { data } = await api.get<ActiveBrandResponse>('/brand/user/active');
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Failed to get active brand' };
        }
    },

    async createBrand(name: string): Promise<ActiveBrandResponse> {
        try {
            const { data } = await api.post<ActiveBrandResponse>('/brand/user', { name });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Failed to create brand' };
        }
    },

    async updateBrandConfig(brandId: string, config: Partial<BrandConfig>): Promise<any> {
        try {
            const { data } = await api.put('/brand/user/config', { brandId, config });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Failed to update brand config' };
        }
    },

    async getBrandVersions(brandId: string): Promise<any> {
        try {
            const { data } = await api.get(`/brand/user/versions/${brandId}`);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw axiosError.response?.data || { error: 'Failed to get brand versions' };
        }
    }
};