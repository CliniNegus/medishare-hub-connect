import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to MediShare Hub Connect
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Connecting hospitals, manufacturers, and investors for efficient medical equipment sharing.
      </p>
      <div className="space-x-4">
        <Link to="/auth">
          <Button variant="outline">
            Get Started
          </Button>
        </Link>
        <Button asChild>
          <Link to="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </div>

      <div className="text-center mt-8">
        <Link to="/admin-auth" className="text-xs text-gray-500 hover:text-red-600">
          Administrator Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
