import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, DollarSign, FileText, Target, 
  Settings, Users, LogOut, UserCog, Home,
  TrendingUp, PiggyBank, Building
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface InvestorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onChangeAccountType?: () => void;
}

const InvestorSidebar = ({ activeTab, setActiveTab, onChangeAccountType }: InvestorSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart2 },
    { id: 'portfolio', label: 'Portfolio', icon: PiggyBank },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const secondaryItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { action: () => navigate('/dashboard'), label: 'Switch Dashboard', icon: Home },
  ];

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/auth');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'I';
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#333333] to-black text-white h-screen fixed left-0 top-0 z-20 shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-[#E02020]/10 to-transparent">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/661de53b-e7ab-4711-97b0-ac4cf9c089f0.png" 
            alt="Clinibuilds Logo" 
            className="h-10 w-auto mr-3"
          />
          <div>
            <h1 className="text-xl font-bold text-white">CliniBuilds</h1>
            <p className="text-xs text-gray-300">Investor Hub</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#E02020] to-[#c01010] text-white shadow-lg transform scale-105' 
                    : 'hover:bg-white/10 text-gray-300 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="pt-8 mt-8 border-t border-gray-700/50">
          <div className="space-y-2">
            {secondaryItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = 'id' in item && activeTab === item.id;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if ('action' in item) {
                      item.action();
                    } else if ('id' in item) {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#E02020] to-[#c01010] text-white shadow-lg' 
                      : 'hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* User Actions */}
            <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-lg mb-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E02020] to-[#B91C1C] flex items-center justify-center text-white text-xs font-semibold">
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || 'Investor'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Investor Account
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onChangeAccountType}
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
              >
                <UserCog className="mr-3 h-4 w-4" />
                Account Settings
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
              >
                <LogOut className="mr-3 h-4 w-4" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom decoration */}
      <div className="p-4">
        <div className="h-1 bg-gradient-to-r from-[#E02020] to-[#c01010] rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default InvestorSidebar;