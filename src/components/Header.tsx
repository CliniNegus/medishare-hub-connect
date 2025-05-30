
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Settings, UserCircle, Package, ShoppingCart, Home, Calculator, LayoutDashboard, LogOut, Trash2, UserCog, Menu, X } from "lucide-react";
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
      
      // Delete the user account from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      
      // Sign out and redirect to auth page
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
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#E02020] to-[#B91C1C] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    {/* CliniBuilds Logo - Using a medical cross icon as placeholder */}
                    <svg 
                      className="h-6 w-6 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 8h-2V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#E02020] to-[#B91C1C] rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-[#333333] tracking-tight leading-none">
                    CliniBuilds
                  </h1>
                  <span className="text-xs text-gray-500 font-medium tracking-wide">
                    Medical Equipment Platform
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive(item.path)
                        ? 'text-[#E02020] bg-red-50/80'
                        : 'text-gray-600 hover:text-[#E02020] hover:bg-gray-50/80'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#E02020] rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {user && <UserRoleSelector />}
              
              {user && (
                <>
                  <NotificationDropdown />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="relative h-9 w-9 rounded-lg hover:bg-gray-100/80 transition-colors duration-200"
                      >
                        <Settings className="h-5 w-5 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl z-50">
                      <DropdownMenuItem 
                        onClick={() => navigate('/profile')}
                        className="cursor-pointer hover:bg-gray-50/80 focus:bg-gray-50/80"
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile Management
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => navigate('/security-settings')}
                        className="cursor-pointer hover:bg-gray-50/80 focus:bg-gray-50/80"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Security Settings
                      </DropdownMenuItem>
                      
                      {role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => navigate('/admin')}
                            className="cursor-pointer hover:bg-gray-50/80 focus:bg-gray-50/80"
                          >
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin Settings
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => setAccountTypeModalOpen(true)}
                        className="cursor-pointer hover:bg-gray-50/80 focus:bg-gray-50/80"
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Change Account Type
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:flex items-center space-x-2 border-gray-200 hover:border-[#E02020] hover:text-[#E02020] transition-colors duration-200"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span className="capitalize font-medium">{role}</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-[#E02020] hover:bg-red-50/80 transition-colors duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl z-50">
                      <DropdownMenuItem
                        onClick={() => setAccountTypeModalOpen(true)}
                        className="cursor-pointer hover:bg-gray-50/80 focus:bg-gray-50/80"
                      >
                        <UserCog className="h-4 w-4 mr-2 text-gray-500" />
                        Change Account Type
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer hover:bg-gray-50/80 focus:bg-gray-50/80"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                        Sign Out
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer text-red-600 hover:bg-red-50/80 focus:bg-red-50/80"
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Delete Account
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/95 backdrop-blur-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
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
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200">
                    Login / Register
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
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
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-[#E02020] bg-red-50/80'
                      : 'text-gray-600 hover:text-[#E02020] hover:bg-gray-50/80'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Account Type Change Modal */}
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen} 
        onOpenChange={setAccountTypeModalOpen} 
      />
    </>
  );
};

export default Header;
