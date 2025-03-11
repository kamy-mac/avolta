/**
 * Protected Route Component
 * 
 * This component restricts access to routes based on authentication status.
 * It redirects unauthenticated users to the login page.
 * 
 * @module components/auth/ProtectedRoute
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected route props
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component
 * 
 * Renders children only if user is authenticated, otherwise redirects to login
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}