// src/utils/auth.ts
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// For API calls that might fail with 401
export const handleAuthError = (error: any): void => {
    if (error.response?.status === 401 || error.message?.includes('401')) {
        removeToken();
        window.location.href = '/login';
    }
};