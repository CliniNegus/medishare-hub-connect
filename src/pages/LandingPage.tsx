import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-4xl font-bold text-white mb-4">
        Welcome to CliniBuilds
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Connecting hospitals, manufacturers, and investors for efficient medical equipment sharing.
      </p>
      <div className="space-x-4">
        <Link to="/auth">
          <Button variant="outline" className="text-white border-red-600 hover:bg-red-700 hover:text-white">
            Get Started
          </Button>
        </Link>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link to="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline" className="text-white border-red-600 hover:bg-red-700 hover:text-white">
          <Link to="/hospitals">
            <MapPin className="h-4 w-4 mr-2" />
            View Hospitals
          </Link>
        </Button>
      </div>

      <div className="text-center mt-8">
        <Link to="/admin-auth" className="text-xs text-gray-400 hover:text-red-600">
          Administrator Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
