// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User, Brand, ActiveBrandResponse, ApiError } from '../types';
import { authService } from '../services/auth.service';
import { brandService } from '../services/brand.service';
import api from '../services/api';

interface AuthContextType {
    user: User | null;
    brand: ActiveBrandResponse | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshBrand: () => Promise<void>;
    switchBrand: (brandId: string) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [brand, setBrand] = useState<ActiveBrandResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
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
            if (brandData) {
                setBrand(brandData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await authService.login({ email, password });
            setUser(data.user);
            if (data.brand) {
                const brandData = await brandService.getActiveBrand();
                setBrand(brandData);
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
            if (data.brand) {
                const brandData = await brandService.getActiveBrand();
                setBrand(brandData);
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.error || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // src/contexts/AuthContext.tsx - Fix the switchBrand function

    const switchBrand = async (brandId: string) => {
        try {
            setIsLoading(true);
            console.log("🔄 Switching to brand:", brandId); // Add debug log

            // FIXED: Use backticks instead of single quotes
            const response = await api.post(`/brand/user/switch/${brandId}`);

            console.log("✅ Switch response:", response.data);

            // Fetch the new active brand data
            const brandData = await brandService.getActiveBrand();
            setBrand(brandData);

            // Trigger a page refresh by reloading the window
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
        } catch (error) {
            console.error('Failed to refresh brand:', error);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setBrand(null);
        setError(null);
        window.location.href = '/login';
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            brand,
            isLoading,
            error,
            login,
            register,
            logout,
            refreshBrand,
            switchBrand,
            clearError
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