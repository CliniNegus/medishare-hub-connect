
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Only show on mobile devices
  if (!isMobile) return null;

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      console.log('Starting sign out process from FAB...');
      setIsExpanded(false);
      
      // Call the signOut method from AuthContext
      await signOut();
      
      // Navigate with state to indicate we came from sign out
      navigate('/auth', { state: { fromSignOut: true } });
      
      console.log('Sign out completed successfully from FAB');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      console.error('Error during sign out from FAB:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const actions = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => {
        navigate('/profile');
        setIsExpanded(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        navigate('/system');
        setIsExpanded(false);
      },
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      icon: LogOut,
      label: isSigningOut ? 'Signing out...' : 'Sign Out',
      onClick: handleSignOut,
      disabled: isSigningOut,
      color: isSigningOut ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      {isExpanded && (
        <div className="flex flex-col items-end space-y-3 mb-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.label}
                className="flex items-center space-x-3 animate-in slide-in-from-right duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`h-12 w-12 rounded-full shadow-lg ${action.color} text-white ${
                    action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          isExpanded 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-[#E02020] hover:bg-[#c01c1c]'
        } text-white`}
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
