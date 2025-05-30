
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Settings, UserCircle, Package, ShoppingCart, Home, Calculator, LayoutDashboard, LogOut, Trash2, UserCog, Menu, X, Bell } from "lucide-react";
import UserRoleSelector from './UserRoleSelector';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import NotificationDropdown from './notifications/NotificationDropdown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      
      await signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error deleting account",
        description: error.message || "There was a problem deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
    { path: '/inventory', label: 'Inventory', icon: Package, roles: ['hospital', 'admin', 'manufacturer'] },
    { path: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['hospital', 'admin', 'manufacturer'] },
    { path: '/financing', label: 'Financing', icon: Calculator, roles: ['hospital', 'admin', 'investor'] },
    { path: '/admin', label: 'Admin', icon: LayoutDashboard, roles: ['admin'] },
    { path: '/shop', label: 'Shop', icon: ShoppingCart, roles: ['all'] },
  ];

  const visibleNavItems = navigationItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(role)
  );

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#E02020] to-[#B91C1C] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                  <svg 
                    className="h-6 w-6 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 8h-2V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-[#333333] tracking-tight">
                  CliniBuilds
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-[#E02020] bg-red-50'
                        : 'text-gray-700 hover:text-[#E02020] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <UserRoleSelector />
                  <NotificationDropdown />
                  
                  {/* Unified User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center space-x-2 text-gray-700 hover:text-[#E02020] hover:bg-gray-50"
                      >
                        <UserCircle className="h-5 w-5" />
                        <span className="hidden sm:inline capitalize">{role}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile Management
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/security-settings')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Security Settings
                      </DropdownMenuItem>
                      
                      {role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Admin Settings
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => setAccountTypeModalOpen(true)}>
                        <UserCog className="h-4 w-4 mr-2" />
                        Change Account Type
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 text-white hover:bg-red-700" 
                              onClick={handleDeleteAccount}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Deleting..." : "Delete Account"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              
              {!user && (
                <Link to="/auth">
                  <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white font-medium">
                    Login / Register
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-[#E02020] bg-red-50'
                      : 'text-gray-700 hover:text-[#E02020] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen} 
        onOpenChange={setAccountTypeModalOpen} 
      />
    </>
  );
};

export default Header;
