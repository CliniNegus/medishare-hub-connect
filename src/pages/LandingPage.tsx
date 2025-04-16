
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hospital, Factory, PiggyBank, ArrowRight, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { setRole } = useUserRole();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in and has a role, redirect to appropriate dashboard
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else if (profile.role) {
        navigate('/dashboard');
      }
    }
  }, [user, profile, navigate]);

  const handleRoleSelect = (role: 'hospital' | 'manufacturer' | 'investor') => {
    setRole(role);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-12 w-12 rounded-md bg-gradient-to-r from-red-600 to-black"></div>
            <h1 className="text-3xl md:text-4xl font-bold ml-4 text-black">CliniBuilds</h1>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-black mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Medical Equipment Sharing Platform
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Connect hospitals, manufacturers, and investors in a streamlined ecosystem for medical equipment leasing, financing, and management.
          </motion.p>
        </div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <Hospital className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">For Hospitals & Clinics</h3>
            <p className="text-gray-600">
              Access to cutting-edge medical equipment without the large upfront costs. Manage inventory, track maintenance, and place orders efficiently.
            </p>
          </motion.div>
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <Factory className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">For Manufacturers</h3>
            <p className="text-gray-600">
              Expand your market reach, track leased equipment, manage maintenance schedules, and maintain direct relationships with healthcare providers.
            </p>
          </motion.div>
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <PiggyBank className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">For Investors</h3>
            <p className="text-gray-600">
              Fund medical equipment acquisitions, track returns on investments, and support healthcare innovation with secure, transparent financing options.
            </p>
          </motion.div>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Choose Your Role to Get Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow border border-gray-200 hover:-translate-y-1 transition-transform duration-300">
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
                  <Button className="w-full bg-red-600 hover:bg-red-700 group">
                    Enter as Hospital <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border border-gray-200 hover:-translate-y-1 transition-transform duration-300">
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
                  <Button className="w-full bg-red-600 hover:bg-red-700 group">
                    Enter as Manufacturer <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border border-gray-200 hover:-translate-y-1 transition-transform duration-300">
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
                  <Button className="w-full bg-red-600 hover:bg-red-700 group">
                    Enter as Investor <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
        
        {/* Admin Login Link */}
        <div className="text-center mt-12">
          <Link to="/auth" className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
            <Users className="h-4 w-4 mr-2" />
            Admin Login
            <ArrowUpRight className="h-4 w-4 ml-1" />
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
