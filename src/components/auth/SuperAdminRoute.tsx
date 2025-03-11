/**
 * Super Admin Route Component
 * 
 * This component restricts access to routes based on user role.
 * It redirects non-super-admin users to the admin dashboard.
 * 
 * @module components/auth/SuperAdminRoute
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Super admin route props
 */
interface SuperAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Super admin route component
 * 
 * Renders children only if user is a super admin, otherwise redirects to admin dashboard
 */
export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { isSuperAdmin } = useAuth();

  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}