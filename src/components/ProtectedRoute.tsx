import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, useUserRole } from '@/contexts/UserRoleContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: UserRole[];
}

/**
 * Protected route component that enforces authentication and profile completion
 * Users cannot access dashboards without completing onboarding
 */
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  allowedRoles 
}: ProtectedRouteProps) => {
  const { user, profile, loading, userRoles } = useAuth();
  const { isRoleAuthorized } = useUserRole();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // No user - redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if profile needs to be completed
  // Skip this check for complete-profile route and auth callback
  const isCompleteProfileRoute = location.pathname === '/complete-profile';
  const isAuthCallbackRoute = location.pathname === '/auth/callback';
  
  if (!isCompleteProfileRoute && !isAuthCallbackRoute) {
    // Check if profile is complete
    const profileComplete = profile?.onboarding_completed || profile?.profile_completed;
    
    if (!profileComplete) {
      return <Navigate to="/complete-profile" replace />;
    }
    
    // Additional check: ensure user has required role assignment (except for admin routes)
    if (!requireAdmin && !userRoles.primaryRole && !userRoles.isAdmin) {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  // Automatic redirection to admin dashboard for admin users
  // Only redirect if they're not already trying to access the admin route
  if (userRoles.isAdmin && !requireAdmin && 
      !location.pathname.startsWith('/admin') && 
      !isCompleteProfileRoute) {
    return <Navigate to="/admin" replace />;
  }

  // Check admin role if required
  if (requireAdmin && !userRoles.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check allowed roles if specified
  if (allowedRoles && !isRoleAuthorized(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
