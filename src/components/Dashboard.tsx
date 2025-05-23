
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
  const { user, profile, refreshProfile } = useAuth();
  const { role, setRole, isUserRegisteredAs } = useUserRole();
  const navigate = useNavigate();

  // Check if user is authenticated and has a profile role set
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Make sure profile is loaded and role is set correctly
    if (user && profile && profile.role) {
      console.log("Dashboard: Setting role to", profile.role);
      setRole(profile.role as any);
      
      // Redirect admin users to the admin dashboard
      if (profile.role === 'admin') {
        navigate('/admin');
        return;
      }
    }
  }, [user, profile, navigate, setRole]);

  // Refresh profile when dashboard loads to ensure we have the latest data
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [refreshProfile, user]);

  // For debugging
  useEffect(() => {
    console.log("Dashboard component - Current user role:", role);
    console.log("Dashboard component - User profile:", profile);
  }, [role, profile]);

  // If user doesn't have a profile role or tries to access a dashboard they're not registered for
  if (profile && !isUserRegisteredAs(profile.role as any)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md p-6">
          <Alert className="border-red-600 bg-red-50">
            <AlertTitle className="text-red-800">Access Restricted</AlertTitle>
            <AlertDescription className="text-red-800">
              You are registered as a {profile.role}, but trying to access a different dashboard.
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
  if (!profile) {
    console.log("Dashboard - Profile not loaded yet");
    return <div className="h-screen flex items-center justify-center">Loading profile...</div>;
  }

  console.log("Dashboard - Rendering dashboard for role:", profile.role);

  // Render the dashboard based on the profile's role
  switch (profile.role) {
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
