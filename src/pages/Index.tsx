
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FeatureSlides from '@/components/landing/FeatureSlides';
import OptimizedImage from '@/components/OptimizedImage';
import DashboardShowcase from '@/components/landing/DashboardShowcase';
import { InputValidator, useFormValidation } from '@/components/security/InputValidator';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Clock,
  Store,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Menu,
  X,
  Twitter,
  Instagram,
  Linkedin,
  Facebook
} from "lucide-react";

const Index: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const { errors, validateField, clearError } = useFormValidation();
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateField('email', newsletterEmail, 'email')) {
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call for newsletter subscription
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about CliniBuilds platform.",
      });
      
      setNewsletterEmail('');
      clearError('email');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative">
      {/* Background Logo Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="relative">
          <OptimizedImage
            src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
            alt="CliniBuilds Background Logo"
            height={800}
            className="object-contain opacity-[0.03] scale-150 select-none"
          />
        </div>
      </div>

      {/* All content wrapper with higher z-index */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="relative bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              {/* Logo in Navigation - Made more visible */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <OptimizedImage
                    src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
                    alt="CliniBuilds Logo"
                    height={50}
                    className="object-contain rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-[#333333] hover:text-[#E02020] font-medium transition-colors">Features</a>
                <a href="#showcase" className="text-[#333333] hover:text-[#E02020] font-medium transition-colors">Platform</a>
                <a href="#benefits" className="text-[#333333] hover:text-[#E02020] font-medium transition-colors">Benefits</a>
                <Button asChild variant="outline" className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-[#E02020] hover:bg-[#E02020]/90">
                  <Link to="/shop/public">Browse Shop</Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-[#333333]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
                <div className="flex flex-col gap-4 p-6">
                  <a href="#features" className="text-[#333333] hover:text-[#E02020] font-medium">Features</a>
                  <a href="#showcase" className="text-[#333333] hover:text-[#E02020] font-medium">Platform</a>
                  <a href="#benefits" className="text-[#333333] hover:text-[#E02020] font-medium">Benefits</a>
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <Button asChild variant="outline" className="border-[#E02020] text-[#E02020]">
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button asChild className="bg-[#E02020] hover:bg-[#E02020]/90">
                      <Link to="/shop/public">Browse Shop</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative py-20 lg:py-32 border-b border-gray-100 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-red-100/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            {/* Hero Content with Large Background Logo */}
            <div className="relative mb-12 space-y-6">
              {/* Large Background Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <OptimizedImage
                  src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
                  alt="CliniBuilds Background Logo"
                  height={400}
                  className="object-contain opacity-[0.15] select-none"
                />
              </div>
              
              {/* Foreground Content */}
              <div className="relative z-10">
                <p className="text-2xl lg:text-3xl font-semibold text-[#E02020] tracking-wide mb-4">
                  Medical Equipment Platform
                </p>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="h-1 w-20 bg-gradient-to-r from-[#E02020] to-red-400 rounded-full"></div>
                  <span className="text-sm font-medium text-[#333333]/60 uppercase tracking-widest">Leading Innovation</span>
                  <div className="h-1 w-20 bg-gradient-to-r from-red-400 to-[#E02020] rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Description and Trust Indicators */}
            <div className="max-w-4xl mx-auto mb-12 space-y-8">
              <p className="text-xl leading-relaxed text-[#333333]/80">
                Connecting hospitals, manufacturers, and investors for efficient medical equipment sharing, 
                reducing costs and improving healthcare outcomes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#333333]/60">
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>500+ Hospitals</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>95% Cost Reduction</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time Tracking</span>
                </div>
              </div>
            </div>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto">
              <Button asChild size="lg" className="bg-gradient-to-r from-[#E02020] to-[#E02020]/90 hover:from-[#E02020]/90 hover:to-[#E02020] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group text-base">
                <Link to="/shop/public" className="flex items-center gap-2">
                  Browse Medical Supplies
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#333333] mb-4">Platform Features</h2>
              <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto">
                Discover how our comprehensive platform transforms medical equipment management
              </p>
            </div>
            <FeatureSlides />
          </div>
        </div>

        {/* Benefits Section */}
        <div id="benefits" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-[#333333]">
                    Transform Your Healthcare Operations
                  </h2>
                  <p className="text-lg text-[#333333]/70 mb-8">
                    Experience the power of modern medical equipment management with our comprehensive platform
                  </p>
                </div>
                
                <ul className="space-y-6">
                  {[
                    { icon: <Store className="h-7 w-7 text-[#E02020]" />, text: "Manage virtual shops across multiple countries", highlight: "Global Reach" },
                    { icon: <Clock className="h-7 w-7 text-[#E02020]" />, text: "Reduce equipment acquisition time by up to 50%", highlight: "Faster Deployment" },
                    { icon: <TrendingUp className="h-7 w-7 text-[#E02020]" />, text: "Increase equipment utilization by 30-40%", highlight: "Better ROI" },
                    { icon: <Users className="h-7 w-7 text-[#E02020]" />, text: "Serve more patients with efficient equipment distribution", highlight: "Patient Care" },
                    { icon: <Heart className="h-7 w-7 text-[#E02020]" />, text: "Improve patient outcomes through better equipment access", highlight: "Health Impact" }
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start group hover:bg-white/50 p-4 rounded-xl transition-all duration-300">
                      <div className="bg-red-50 p-3 rounded-lg mr-4 group-hover:bg-[#E02020] group-hover:text-white transition-all duration-300">
                        {benefit.icon}
                      </div>
                      <div>
                        <span className="font-semibold text-[#E02020] text-sm uppercase tracking-wide">{benefit.highlight}</span>
                        <p className="text-[#333333] mt-1">{benefit.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-[#333333] mb-2">Impact Metrics</h3>
                    <p className="text-[#333333]/60">Real results from our platform users</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: "45%", label: "Cost Reduction", color: "from-red-500 to-pink-500" },
                      { value: "60%", label: "Faster Deployment", color: "from-blue-500 to-cyan-500" },
                      { value: "32%", label: "More Patients Served", color: "from-green-500 to-emerald-500" },
                      { value: "28%", label: "Maintenance Cost Reduction", color: "from-purple-500 to-violet-500" }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                        <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform`}>
                          {stat.value}
                        </div>
                        <div className="text-sm font-medium text-[#333333]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Showcase Section */}
        <div id="showcase" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#333333] mb-4">Platform in Action</h2>
              <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto">
                See how our intuitive dashboards empower different user roles to achieve their goals
              </p>
            </div>
            <DashboardShowcase />
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-20 bg-gradient-to-br from-[#E02020]/5 via-white to-[#E02020]/5 border-t border-gray-100 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-40 h-40 bg-[#E02020]/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-[#333333]">
                Ready to Transform Your Medical Equipment Management?
              </h2>
              <p className="text-xl mb-10 text-[#333333]/80 leading-relaxed">
                Join hospitals, manufacturers, and investors already benefiting from our virtual shops platform.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#E02020] to-[#E02020]/90 hover:from-[#E02020]/90 hover:to-[#E02020] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Link to="/auth" className="flex items-center gap-2">
                    Sign Up Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                  <Link to="/dashboard">Explore Dashboard</Link>
                </Button>
              </div>
              
              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[#333333]/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <footer className="bg-[#E02020] text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <OptimizedImage
                    src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
                    alt="CliniBuilds Logo"
                    height={40}
                    className="object-contain rounded-md bg-white/20 p-1"
                  />
                  <h2 className="text-2xl font-bold">CliniBuilds</h2>
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">
                  CliniBuilds is a medical equipment management platform, connecting hospitals, manufacturers, and investors for efficient healthcare solutions.
                </p>
                <p className="text-sm text-white/60 mb-6">
                  All medical equipment services are securely provided by our licensed partners who are members of healthcare insurance schemes, ensuring the safety of your medical operations.
                </p>
                
                {/* Social Media Icons */}
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-bold mb-6">Products</h3>
                <ul className="space-y-3">
                  <li><Link to="/shop/public" className="text-white/80 hover:text-white transition-colors">Medical Equipment</Link></li>
                  <li><Link to="/equipment-tracking" className="text-white/80 hover:text-white transition-colors">Equipment Tracking</Link></li>
                  <li><Link to="/lease-management" className="text-white/80 hover:text-white transition-colors">Lease Management</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-lg font-bold mb-6">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#about" className="text-white/80 hover:text-white transition-colors">About Us</a></li>
                  <li><Link to="/hospital-locations" className="text-white/80 hover:text-white transition-colors">Hospital Network</Link></li>
                  <li><Link to="/integrations" className="text-white/80 hover:text-white transition-colors">Partnerships</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-bold mb-6">Resources</h3>
                <ul className="space-y-3">
                  <li><Link to="/system-management" className="text-white/80 hover:text-white transition-colors">Tools</Link></li>
                  <li><Link to="/auth" className="text-white/80 hover:text-white transition-colors">Developers</Link></li>
                  <li><a href="#blog" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
                  <p className="text-white/80">Stay updated with the latest medical equipment innovations and platform updates.</p>
                </div>
                
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3 w-full max-w-md">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="hello@clinibuilds.co"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (errors.email) clearError('email');
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    />
                    {errors.email && (
                      <p className="text-red-200 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-white text-[#E02020] hover:bg-white/90 font-semibold px-6"
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/60">
                © {new Date().getFullYear()} CliniBuilds. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Use</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
