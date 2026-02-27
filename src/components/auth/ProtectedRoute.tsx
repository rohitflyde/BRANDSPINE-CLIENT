// src/components/auth/ProtectedRoute.tsx
import React, { useRef, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const { user, isLoading, isFirstTimeUser } = useAuth();
  const location = useLocation();
  const hasRedirected = useRef(false);

  // Reset redirect flag when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

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

  // Case 1: Route requires auth but user is not authenticated
  if (requireAuth && !user) {
    hasRedirected.current = true;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Case 2: User is authenticated and it's their first time
  // Redirect to theme selection if not already there
  if (requireAuth && user && isFirstTimeUser && location.pathname !== '/theme-selection') {
    hasRedirected.current = true;
    return <Navigate to="/theme-selection" replace />;
  }

  // Case 3: User is authenticated, not first time, but trying to access theme selection
  if (requireAuth && user && !isFirstTimeUser && location.pathname === '/theme-selection') {
    hasRedirected.current = true;
    return <Navigate to="/editor" replace />;
  }

  // Case 4: User is authenticated and trying to access login/register
  if (!requireAuth && user) {
    const redirectPath = isFirstTimeUser ? '/theme-selection' : '/editor';
    hasRedirected.current = true;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};