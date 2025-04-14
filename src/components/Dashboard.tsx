
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import HospitalDashboard from './HospitalDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import InvestorDashboard from './InvestorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { role, isUserRegisteredAs } = useUserRole();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has a profile role set
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // If user doesn't have a profile role or tries to access a dashboard they're not registered for
  if (profile && !isUserRegisteredAs(role as any)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md p-6">
          <Alert className="border-red-600 bg-red-50">
            <AlertTitle className="text-red-800">Access Restricted</AlertTitle>
            <AlertDescription className="text-red-800">
              You are registered as a {profile.role}, but trying to access the {role} dashboard.
              Please switch to your registered role's dashboard.
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

  // Render appropriate dashboard based on user's registered role
  switch (profile?.role) {
    case 'manufacturer':
      return <ManufacturerDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'hospital':
    default:
      return <HospitalDashboard />;
  }
};

export default Dashboard;
