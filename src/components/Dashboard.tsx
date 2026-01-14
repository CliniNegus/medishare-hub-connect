
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import HospitalDashboard from './HospitalDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import InvestorDashboard from './InvestorDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, refreshProfile, userRoles, loading: authLoading } = useAuth();
  const { role, setRole, isUserRegisteredAs, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  // Refresh profile when dashboard loads to ensure we have the latest data
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [refreshProfile, user]);

  // Set role and handle admin redirect
  useEffect(() => {
    if (authLoading || roleLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Use the primary role from user_roles table
    const primaryRole = userRoles.primaryRole || profile?.role;
    if (primaryRole) {
      setRole(primaryRole);
      
      // Redirect admin users to the admin dashboard
      if (userRoles.isAdmin) {
        navigate('/admin');
        return;
      }
    }
  }, [user, userRoles, profile?.role, navigate, setRole, authLoading, roleLoading]);

  // Show loading state while auth or roles are loading
  if (authLoading || roleLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have a profile role or tries to access a dashboard they're not registered for
  if (role && !isUserRegisteredAs(role)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md p-6">
          <Alert className="border-red-600 bg-red-50">
            <AlertTitle className="text-red-800">Access Restricted</AlertTitle>
            <AlertDescription className="text-red-800">
              You are registered as a {userRoles.primaryRole || profile?.role}, but trying to access a different dashboard.
              Please use your registered role's dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentRole = userRoles.primaryRole || profile?.role || role;

  // Render the dashboard based on the user's role
  switch (currentRole) {
    case 'manufacturer':
      return <ManufacturerDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'hospital':
    default:
      return <HospitalDashboard />;
  }
};

export default Dashboard;
