
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, useUserRole } from '@/contexts/UserRoleContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  allowedRoles 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const { isRoleAuthorized } = useUserRole();
  const location = useLocation();

  if (loading) {
    // You could show a loading spinner here
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if profile needs to be completed (except for complete-profile route)
  if (profile && !profile.profile_completed && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // Automatic redirection to admin dashboard for admin users
  // Only redirect if they're not already trying to access the admin route
  if (profile?.role === 'admin' && !requireAdmin && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }

  // Check admin role if required
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check allowed roles if specified
  if (allowedRoles && !isRoleAuthorized(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
