
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
  const { user, profile, refreshProfile, userRoles } = useAuth();
  const { role, setRole, isUserRegisteredAs, hasRole, isAdmin } = useUserRole();
  const navigate = useNavigate();

  // Check if user is authenticated and has a profile role set
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Use the primary role from user_roles table
    if (user && userRoles.primaryRole) {
      console.log("Dashboard: Setting role to", userRoles.primaryRole);
      setRole(userRoles.primaryRole);
      
      // Redirect admin users to the admin dashboard
      if (userRoles.isAdmin) {
        navigate('/admin');
        return;
      }
    }
  }, [user, userRoles, navigate, setRole]);

  // Refresh profile when dashboard loads to ensure we have the latest data
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [refreshProfile, user]);

  // For debugging
  useEffect(() => {
    console.log("Dashboard component - Current user role:", role);
    console.log("Dashboard component - User roles from DB:", userRoles.roles);
  }, [role, userRoles]);

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

  // For debugging
  if (!profile && !userRoles.primaryRole) {
    console.log("Dashboard - Profile and roles not loaded yet");
    return <div className="h-screen flex items-center justify-center">Loading profile...</div>;
  }

  const currentRole = userRoles.primaryRole || profile?.role;
  console.log("Dashboard - Rendering dashboard for role:", currentRole);

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
