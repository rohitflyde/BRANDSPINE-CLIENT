// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type { User, Brand, ActiveBrandResponse, ApiError } from '../types';
import { authService } from '../services/auth.service';
import { brandService } from '../services/brand.service';
import api from '../services/api';

interface AuthContextType {
    user: User | null;
    brand: ActiveBrandResponse | null;
    isLoading: boolean;
    error: string | null;
    isFirstTimeUser: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshBrand: () => Promise<void>;
    switchBrand: (brandId: string) => Promise<void>;
    clearError: () => void;
    completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [brand, setBrand] = useState<ActiveBrandResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const [authData, brandData] = await Promise.all([
                authService.getCurrentUser(),
                brandService.getActiveBrand().catch(() => null)
            ]);

            setUser(authData.user);

            if (!brandData) {
                setIsFirstTimeUser(true);
            } else {
                const isDefault = brandData.brand.name === 'Default Brand' &&
                    !brandData.config.meta?.customized;
                setIsFirstTimeUser(isDefault);
                setBrand(brandData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    }, []); // Add proper dependencies

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await authService.login({ email, password });
            setUser(data.user);

            if (data.brand) {
                const brandData = await brandService.getActiveBrand();
                setBrand(brandData);

                // Check if first time
                const isDefault = brandData.brand.name === 'Default Brand' &&
                    !brandData.config.meta?.customized;
                setIsFirstTimeUser(isDefault);
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.error || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (registerData: any) => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await authService.register(registerData);
            setUser(data.user);

            // After registration, user should go to theme selection
            setIsFirstTimeUser(true);

            if (data.brand) {
                setBrand({
                    brand: data.brand,
                    config: null // No config yet until theme is selected
                });
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.error || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const switchBrand = async (brandId: string) => {
        try {
            setIsLoading(true);
            console.log("🔄 Switching to brand:", brandId);

            const response = await api.post(`/brand/user/switch/${brandId}`);
            console.log("✅ Switch response:", response.data);

            const brandData = await brandService.getActiveBrand();
            setBrand(brandData);
            window.location.reload();
        } catch (err) {
            console.error("❌ Switch brand error:", err);
            const apiError = err as ApiError;
            setError(apiError.error || 'Failed to switch brand');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshBrand = async () => {
        try {
            const brandData = await brandService.getActiveBrand();
            setBrand(brandData);

            // Update first time status
            if (brandData) {
                const isDefault = brandData.brand.name === 'Default Brand' &&
                    !brandData.config.meta?.customized;
                setIsFirstTimeUser(isDefault);
            }
        } catch (error) {
            console.error('Failed to refresh brand:', error);
        }
    };

    const completeOnboarding = () => {
        setIsFirstTimeUser(false);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setBrand(null);
        setError(null);
        setIsFirstTimeUser(false);
        window.location.href = '/login';
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            brand,
            isLoading,
            error,
            isFirstTimeUser,
            login,
            register,
            logout,
            refreshBrand,
            switchBrand,
            clearError,
            completeOnboarding
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};