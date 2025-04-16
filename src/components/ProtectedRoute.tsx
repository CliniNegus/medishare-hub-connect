
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, useUserRole } from '@/contexts/UserRoleContext';
import { LoadingScreen } from '@/components/ui/loader';

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
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in and has admin role but is not on admin route yet
    if (user && profile?.role === 'admin' && !location.pathname.startsWith('/admin')) {
      // But not if they're explicitly trying to access a non-admin page
      if (!requireAdmin && !location.pathname.startsWith('/dashboard')) {
        navigate('/admin');
      }
    }
  }, [user, profile, location.pathname, navigate, requireAdmin]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
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
