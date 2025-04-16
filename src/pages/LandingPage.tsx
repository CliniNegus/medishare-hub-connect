
import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital, Factory, PiggyBank, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRole } from '@/contexts/UserRoleContext';

const LandingPage = () => {
  const { setRole } = useUserRole();

  const handleRoleSelect = (role: 'hospital' | 'manufacturer' | 'investor') => {
    setRole(role);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-md bg-gradient-to-r from-red-600 to-black"></div>
            <h1 className="text-3xl md:text-4xl font-bold ml-4 text-black">CliniBuilds</h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Medical Equipment Sharing Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect hospitals, manufacturers, and investors in a streamlined ecosystem for medical equipment leasing, financing, and management.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <Hospital className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">For Hospitals & Clinics</h3>
            <p className="text-gray-600">
              Access to cutting-edge medical equipment without the large upfront costs. Manage inventory, track maintenance, and place orders efficiently.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <Factory className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">For Manufacturers</h3>
            <p className="text-gray-600">
              Expand your market reach, track leased equipment, manage maintenance schedules, and maintain direct relationships with healthcare providers.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <PiggyBank className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">For Investors</h3>
            <p className="text-gray-600">
              Fund medical equipment acquisitions, track returns on investments, and support healthcare innovation with secure, transparent financing options.
            </p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <h3 className="text-2xl font-bold text-center mb-8">Choose Your Role to Get Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border border-gray-200">
            <CardHeader>
              <Hospital className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Hospital/Clinic</CardTitle>
              <CardDescription>For healthcare facilities seeking equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Access medical equipment leasing options, manage your inventory, track maintenance, and place orders.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/dashboard" onClick={() => handleRoleSelect('hospital')} className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Enter as Hospital <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border border-gray-200">
            <CardHeader>
              <Factory className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Manufacturer</CardTitle>
              <CardDescription>For medical equipment providers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                List your products, manage leases, track equipment locations, and monitor payments.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/dashboard" onClick={() => handleRoleSelect('manufacturer')} className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Enter as Manufacturer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border border-gray-200">
            <CardHeader>
              <PiggyBank className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Investor</CardTitle>
              <CardDescription>For financing medical equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Fund equipment acquisitions, track investments, and monitor returns in the healthcare sector.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/dashboard" onClick={() => handleRoleSelect('investor')} className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Enter as Investor <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Admin Login Link */}
        <div className="text-center mt-12">
          <Link to="/auth" className="text-red-600 hover:text-red-800 underline flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            Admin Login
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 CliniBuilds - Medical Equipment Sharing Platform</p>
          <div className="mt-4">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
