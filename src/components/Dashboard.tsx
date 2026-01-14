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
  const { user, profile, userRoles, loading } = useAuth();
  const { role, setRole, isUserRegisteredAs } = useUserRole();
  const navigate = useNavigate();

  // Handle navigation and role setting
  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Not logged in - redirect to auth
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Redirect admin users to the admin dashboard
    if (userRoles.isAdmin) {
      navigate('/admin');
      return;
    }
    
    // Set the current role from user_roles table or profile
    const primaryRole = userRoles.primaryRole || profile?.role;
    if (primaryRole) {
      setRole(primaryRole);
    }
  }, [user, userRoles, profile?.role, navigate, setRole, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Determine the current role for rendering
  const currentRole = userRoles.primaryRole || profile?.role || role;

  // If user doesn't have a role assigned, they may need to complete profile
  if (!currentRole) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is trying to access a dashboard they're not registered for
  if (role && role !== currentRole && !isUserRegisteredAs(role)) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-full max-w-md p-6">
          <Alert className="border-destructive bg-destructive/10">
            <AlertTitle className="text-destructive">Access Restricted</AlertTitle>
            <AlertDescription className="text-destructive">
              You are registered as a {currentRole}, but trying to access a different dashboard.
              Please use your registered role's dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link to="/">
              <Button variant="destructive">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
