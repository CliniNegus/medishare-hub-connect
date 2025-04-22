
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Users, 
  Clock, 
  Package, 
  CalendarCheck, 
  BookOpen 
} from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black to-red-950 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-8">
            CliniBuilds
            <span className="text-red-600"> Medical Equipment Platform</span>
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Connecting hospitals, manufacturers, and investors for efficient medical equipment sharing, 
            reducing costs and improving healthcare outcomes.
          </p>
          <div className="flex justify-center space-x-6">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/auth">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-red-600 text-white hover:bg-red-900">
              <Link to="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Package className="h-10 w-10 text-red-500 mb-4" />, 
                title: "Equipment Sharing", 
                description: "Easily share equipment between hospitals in the same cluster to reduce costs" 
              },
              { 
                icon: <ShieldCheck className="h-10 w-10 text-red-500 mb-4" />, 
                title: "Equipment Tracking", 
                description: "Real-time tracking of equipment location and usage status" 
              },
              { 
                icon: <TrendingUp className="h-10 w-10 text-red-500 mb-4" />, 
                title: "Financing Options", 
                description: "Connect with investors to fund equipment purchases with flexible terms" 
              },
              { 
                icon: <CalendarCheck className="h-10 w-10 text-red-500 mb-4" />, 
                title: "Maintenance Scheduling", 
                description: "Automated reminders for equipment maintenance to ensure safety" 
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-red-800 hover:border-red-600 transition-all">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-3xl font-bold mb-6">Benefits</h2>
              <ul className="space-y-4">
                {[
                  { icon: <Clock className="h-6 w-6 text-red-500" />, text: "Reduce equipment acquisition time by up to 50%" },
                  { icon: <TrendingUp className="h-6 w-6 text-red-500" />, text: "Increase equipment utilization by 30-40%" },
                  { icon: <Users className="h-6 w-6 text-red-500" />, text: "Serve more patients with the same equipment inventory" },
                  { icon: <Heart className="h-6 w-6 text-red-500" />, text: "Improve patient outcomes through better equipment access" }
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-4 mt-1">{benefit.icon}</span>
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 bg-red-900 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Impact Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "45%", label: "Cost Reduction" },
                  { value: "60%", label: "Faster Deployment" },
                  { value: "32%", label: "More Patients Served" },
                  { value: "28%", label: "Maintenance Cost Reduction" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-black rounded-lg">
                    <div className="text-3xl font-bold text-red-500 mb-2">{stat.value}</div>
                    <div className="text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "CliniBuilds has transformed how we manage our equipment. We've reduced costs by 30% in just six months.",
                author: "Dr. Sarah Johnson",
                role: "Chief of Surgery, Memorial Hospital"
              },
              {
                quote: "As a manufacturer, we've been able to reach more hospitals and increase our leasing revenue significantly.",
                author: "Michael Chen",
                role: "CEO, MedTech Innovations"
              },
              {
                quote: "The ROI on medical equipment investments has improved dramatically since we started using this platform.",
                author: "Emma Williams",
                role: "Investment Director, Healthcare Fund"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-red-800">
                <p className="italic mb-4 text-gray-300">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-red-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-red-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Medical Equipment Management?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hospitals, manufacturers, and investors already benefiting from our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-white text-red-900 hover:bg-gray-200">
              <Link to="/auth">
                Sign Up Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-red-800">
              <Link to="/dashboard">
                Explore Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-black border-t border-red-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-red-600">CliniBuilds</h2>
              <p className="text-gray-400">Medical Equipment Management Platform</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/auth" className="text-gray-400 hover:text-red-500">Sign In</Link>
              <Link to="/admin-auth" className="text-gray-400 hover:text-red-500">Admin</Link>
              <a href="#" className="text-gray-400 hover:text-red-500">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-red-500">Terms of Service</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CliniBuilds. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
