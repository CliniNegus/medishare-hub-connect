
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import FeatureSlides from '@/components/landing/FeatureSlides';
import OptimizedImage from '@/components/OptimizedImage';
import DashboardShowcase from '@/components/landing/DashboardShowcase';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Clock,
  Store,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background via-primary/5 to-background py-20 border-b border-border overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-8 mb-12 animate-fade-in">
            <div className="relative group">
              {/* Logo container with enhanced styling */}
              <div className="relative bg-card p-6 rounded-3xl shadow-2xl border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-500 transform group-hover:scale-105">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Logo image */}
                <OptimizedImage
                  src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
                  alt="CliniBuilds Logo"
                  height={120}
                  className="object-contain rounded-2xl relative z-10 filter group-hover:brightness-110 transition-all duration-300"
                />
                
                {/* Animated sparkles */}
                <div className="absolute -top-3 -right-3 animate-pulse">
                  <Sparkles className="h-8 w-8 text-primary drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-2 -left-2 animate-pulse delay-700">
                  <Sparkles className="h-6 w-6 text-amber-400 drop-shadow-lg" />
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                  #1 Platform
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <h1 className="text-7xl font-bold text-foreground leading-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                CliniBuilds
              </h1>
              <p className="text-3xl font-semibold text-primary mt-3 tracking-wide">
                Medical Equipment Platform
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/80 rounded-full"></div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Leading Innovation</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl leading-relaxed text-foreground/80 mb-6">
              Connecting hospitals, manufacturers, and investors for efficient medical equipment sharing, 
              reducing costs and improving healthcare outcomes.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Trusted by 500+ Hospitals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>95% Cost Reduction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Real-time Tracking</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link to="/shop" className="flex items-center gap-2">
                Browse Medical Supplies
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold px-8 py-4 rounded-xl transition-all duration-300">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how our comprehensive platform transforms medical equipment management
            </p>
          </div>
          <FeatureSlides />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  Transform Your Healthcare Operations
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Experience the power of modern medical equipment management with our comprehensive platform
                </p>
              </div>
              
              <ul className="space-y-6">
                {[
                  { icon: <Store className="h-7 w-7 text-primary" />, text: "Manage virtual shops across multiple countries", highlight: "Global Reach" },
                  { icon: <Clock className="h-7 w-7 text-primary" />, text: "Reduce equipment acquisition time by up to 50%", highlight: "Faster Deployment" },
                  { icon: <TrendingUp className="h-7 w-7 text-primary" />, text: "Increase equipment utilization by 30-40%", highlight: "Better ROI" },
                  { icon: <Users className="h-7 w-7 text-primary" />, text: "Serve more patients with efficient equipment distribution", highlight: "Patient Care" },
                  { icon: <Heart className="h-7 w-7 text-primary" />, text: "Improve patient outcomes through better equipment access", highlight: "Health Impact" }
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start group hover:bg-background/50 p-4 rounded-xl transition-all duration-300">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {benefit.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-primary text-sm uppercase tracking-wide">{benefit.highlight}</span>
                      <p className="text-foreground mt-1">{benefit.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-card p-8 rounded-2xl shadow-xl border border-border">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-card-foreground mb-2">Impact Metrics</h3>
                  <p className="text-muted-foreground">Real results from our platform users</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "45%", label: "Cost Reduction", color: "from-red-500 to-pink-500" },
                    { value: "60%", label: "Faster Deployment", color: "from-blue-500 to-cyan-500" },
                    { value: "32%", label: "More Patients Served", color: "from-green-500 to-emerald-500" },
                    { value: "28%", label: "Maintenance Cost Reduction", color: "from-purple-500 to-violet-500" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-gradient-to-br from-muted/50 to-background rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
                      <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform`}>
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Showcase Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Platform in Action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our intuitive dashboards empower different user roles to achieve their goals
            </p>
          </div>
          <DashboardShowcase />
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-t border-border relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              Ready to Transform Your Medical Equipment Management?
            </h2>
            <p className="text-xl mb-10 text-muted-foreground leading-relaxed">
              Join hospitals, manufacturers, and investors already benefiting from our virtual shops platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Link to="/auth" className="flex items-center gap-2">
                  Sign Up Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
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

      {/* Footer */}
      <footer className="py-12 bg-clinibuilds-dark text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                {/* CliniBuilds Logo */}
                <div className="relative group">
                  <div className="bg-white p-3 rounded-2xl shadow-lg border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 transform group-hover:scale-105">
                    <OptimizedImage
                      src="https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/assets/Clinibuilds%20Logo.jpg"
                      alt="CliniBuilds Logo"
                      height={50}
                      className="object-contain rounded-xl filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-1">CliniBuilds</h2>
                  <p className="text-muted-foreground">Medical Equipment Management Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Transforming healthcare through technology</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Sign In</Link>
              <Link to="/admin-auth" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Admin</Link>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Terms of Service</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CliniBuilds. All rights reserved. • Building the future of healthcare equipment management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
