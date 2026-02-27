// src/components/auth/PublicOnlyRoute.tsx
import React, { useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { user, isLoading, isFirstTimeUser } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    hasRedirected.current = false;
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already redirected, don't redirect again
  if (hasRedirected.current) {
    return <>{children}</>;
  }

  // If user is authenticated, redirect appropriately
  if (user) {
    hasRedirected.current = true;
    if (isFirstTimeUser) {
      return <Navigate to="/theme-selection" replace />;
    }
    return <Navigate to="/editor" replace />;
  }

  return <>{children}</>;
};