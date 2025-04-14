
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/UserRoleContext';

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

  if (loading) {
    // You could show a loading spinner here
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin role if required
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check allowed roles if specified
  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role as UserRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
