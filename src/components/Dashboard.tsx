
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import HospitalDashboard from './HospitalDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import InvestorDashboard from './InvestorDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loader';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { role, setRole, isUserRegisteredAs } = useUserRole();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated and has a profile role set
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        
        // Ensure profile is loaded
        if (user) {
          await refreshProfile();
        }
        
        // Set role from profile
        if (profile && profile.role) {
          setRole(profile.role as any);
          
          // Redirect admin users to the admin dashboard
          if (profile.role === 'admin') {
            navigate('/admin');
            return;
          }
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeDashboard();
  }, [user, profile, navigate, setRole, refreshProfile]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If user doesn't have a profile role or tries to access a dashboard they're not registered for
  if (profile && !isUserRegisteredAs(profile.role as any)) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-full max-w-md p-6">
          <Alert variant="destructive" className="mb-6 animate-fade-in">
            <AlertCircle className="h-5 w-5 mr-2" />
            <AlertTitle className="font-semibold">Access Restricted</AlertTitle>
            <AlertDescription>
              You are registered as a {profile.role}, but trying to access a different dashboard.
              Please use your registered role's dashboard.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-4">
            <Link to="/">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Back to Home
              </Button>
            </Link>
            <Link to={`/dashboard?role=${profile.role}`}>
              <Button variant="outline" className="w-full">
                Go to {profile.role} Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user's registered role
  if (!profile) {
    return <div className="h-screen flex items-center justify-center">Loading profile...</div>;
  }

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
