
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole, UserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RoleDashboardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

const RoleDashboard: React.FC<RoleDashboardProps> = ({ 
  allowedRoles, 
  children, 
  redirectTo = '/' 
}) => {
  const { role, isRoleAuthorized } = useUserRole();
  const { user, profile } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isRoleAuthorized(allowedRoles)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md p-6">
          <Alert className="border-red-600 bg-red-50">
            <AlertTitle className="text-red-800">Access Denied</AlertTitle>
            <AlertDescription className="text-red-800">
              Your account type ({profile?.role || 'unknown'}) doesn't have permission to access this dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link to={redirectTo}>
              <Button className="bg-red-600 hover:bg-red-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleDashboard;
