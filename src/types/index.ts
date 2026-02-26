// src/types/index.ts
export interface User {
  id: string;
  email: string;
  role: 'owner' | 'member';
  tenantId: string;
}

export interface Brand {
  id: string;
  name: string;
  createdAt?: string;
}

export interface BrandConfig {
  meta: {
    name: string;
    description?: string;
    updatedAt: string;
  };
  identity: any;
  colors: any;
  typography: any;
  layout: any;
  assets: any;
}

export interface ActiveBrandResponse {
  brand: Brand;
  config: BrandConfig;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  tenantName: string;
  tenantSlug: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  brand: {
    id: string;
    name: string;
  };
}

// 👇 FIX: Make sure ApiError is exported
export interface ApiError {
  error: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}

// 👇 Add this if you want a type for validation errors
export interface ValidationError {
  param: string;
  msg: string;
  location?: string;
}