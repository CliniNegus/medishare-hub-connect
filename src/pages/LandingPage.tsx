import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import FeatureSlides from '@/components/landing/FeatureSlides';
import OptimizedImage from '@/components/OptimizedImage';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Clock,
  Store
} from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <OptimizedImage
              src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
              alt="CliniBuilds Logo"
              height={40}
              className="object-contain"
            />
            <h1 className="text-5xl font-bold text-[#333333]">
              CliniBuilds
              <span className="text-[#E02020]"> Medical Equipment Platform</span>
            </h1>
          </div>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-[#333333]">
            Connecting hospitals, manufacturers, and investors for efficient medical equipment sharing, 
            reducing costs and improving healthcare outcomes.
          </p>
          <div className="flex justify-center space-x-6">
            <Button asChild size="lg" className="bg-[#E02020] hover:bg-[#E02020]/90 text-white font-semibold">
              <Link to="/shop/public">Browse Medical Supplies</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#333333] text-[#333333] hover:bg-gray-50 font-semibold">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#333333]">Platform Features</h2>
          <FeatureSlides />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-3xl font-bold mb-6 text-[#333333]">Benefits</h2>
              <ul className="space-y-4">
                {[
                  { icon: <Store className="h-6 w-6 text-[#E02020]" />, text: "Manage virtual shops across multiple countries" },
                  { icon: <Clock className="h-6 w-6 text-[#E02020]" />, text: "Reduce equipment acquisition time by up to 50%" },
                  { icon: <TrendingUp className="h-6 w-6 text-[#E02020]" />, text: "Increase equipment utilization by 30-40%" },
                  { icon: <Users className="h-6 w-6 text-[#E02020]" />, text: "Serve more patients with efficient equipment distribution" },
                  { icon: <Heart className="h-6 w-6 text-[#E02020]" />, text: "Improve patient outcomes through better equipment access" }
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-4 mt-1">{benefit.icon}</span>
                    <span className="text-[#333333]">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-[#333333]">Impact Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "45%", label: "Cost Reduction" },
                    { value: "60%", label: "Faster Deployment" },
                    { value: "32%", label: "More Patients Served" },
                    { value: "28%", label: "Maintenance Cost Reduction" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#E02020] mb-2">{stat.value}</div>
                      <div className="text-sm text-[#333333]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#333333]">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The virtual shops feature has revolutionized how we manage and distribute medical equipment across different regions.",
                author: "Dr. Sarah Johnson",
                role: "Chief of Surgery, Memorial Hospital"
              },
              {
                quote: "As a manufacturer, we've expanded our reach globally through virtual shops, significantly increasing our distribution network.",
                author: "Michael Chen",
                role: "CEO, MedTech Innovations"
              },
              {
                quote: "Managing equipment across multiple countries has never been easier. The platform streamlines everything.",
                author: "Emma Williams",
                role: "Investment Director, Healthcare Fund"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="italic mb-4 text-[#333333]">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-[#333333]">{testimonial.author}</p>
                  <p className="text-sm text-[#E02020]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#333333]">Ready to Transform Your Medical Equipment Management?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-[#333333]">
            Join hospitals, manufacturers, and investors already benefiting from our virtual shops platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-[#E02020] hover:bg-[#E02020]/90 text-white font-semibold">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#333333] text-[#333333] hover:bg-gray-50 font-semibold">
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-[#E02020]">CliniBuilds</h2>
              <p className="text-[#333333]">Medical Equipment Management Platform</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/auth" className="text-[#333333] hover:text-[#E02020]">Sign In</Link>
              <Link to="/admin-auth" className="text-[#333333] hover:text-[#E02020]">Admin</Link>
              <a href="#" className="text-[#333333] hover:text-[#E02020]">Privacy Policy</a>
              <a href="#" className="text-[#333333] hover:text-[#E02020]">Terms of Service</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-[#333333]">
            &copy; {new Date().getFullYear()} CliniBuilds. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
