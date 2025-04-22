
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import DarkModeToggle from './ui/dark-mode-toggle';
import { Bell, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Header = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Session timeout hooks
  const { resetSession, timeRemaining, formattedTimeRemaining, isWarning } = useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    onTimeout: () => {
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive"
      });
    },
    onWarning: () => {
      // This is already handled by the hook
    }
  });

  // Simulate notifications
  useEffect(() => {
    if (user) {
      // Simulate receiving notifications
      const randomCount = Math.floor(Math.random() * 5) + 1;
      setNotifications(randomCount);
      
      // Simulate new notification after some time
      const timer = setTimeout(() => {
        setNotifications(prev => prev + 1);
        
        toast({
          title: "New Notification",
          description: "You have a new message or update.",
        });
      }, 60000); // 1 minute
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-red-600 dark:text-red-500">MediShare</span>
            </Link>
            <nav className="hidden sm:ml-6 sm:flex space-x-4">
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                      isActive('/dashboard')
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {(role === 'admin' || role === 'hospital') && (
                    <Link
                      to="/inventory"
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                        isActive('/inventory')
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      Inventory
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                      isActive('/orders')
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    Orders
                  </Link>
                  {(role === 'admin' || role === 'investor' || role === 'hospital') && (
                    <Link
                      to="/financing"
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                        isActive('/financing')
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      Financing
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <DarkModeToggle className="mr-2" />
            
            {/* Session Timeout Indicator */}
            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`hidden sm:flex items-center mx-2 px-2 py-1 rounded-md ${
                      isWarning ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Clock className={`h-4 w-4 mr-1 ${
                        isWarning ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <span className={`text-xs font-mono ${
                        isWarning ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {formattedTimeRemaining}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Session timeout - click to reset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {/* Notifications */}
            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="relative p-1 mr-2 rounded-full text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500">
                      <Bell className="h-6 w-6" />
                      {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs bg-red-600 text-white rounded-full">
                          {notifications}
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You have {notifications} notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {user ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white dark:bg-gray-900 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center text-white">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                      {profile?.full_name || user.email}
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700"></div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-shrink-0">
                <Link to="/auth">
                  <Button className="relative inline-flex items-center bg-red-600 hover:bg-red-700 text-white">
                    Sign in
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {user && (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              {(role === 'admin' || role === 'hospital') && (
                <Link
                  to="/inventory"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/inventory')
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Inventory
                </Link>
              )}
              <Link
                to="/orders"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/orders')
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Orders
              </Link>
              {(role === 'admin' || role === 'investor' || role === 'hospital') && (
                <Link
                  to="/financing"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/financing')
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Financing
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
