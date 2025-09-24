import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Settings, UserCircle, Package, ShoppingCart, Home, Calculator, LayoutDashboard, LogOut, Trash2, UserCog, Menu, X, Bell } from "lucide-react";
import { ThemeToggleButton } from './ThemeToggle';
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
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      console.log('Starting sign out process...');
      
      // Call the signOut method from AuthContext
      await signOut();
      
      // Navigate with state to indicate we came from sign out
      navigate('/auth', { state: { fromSignOut: true } });
      
      console.log('Sign out completed successfully');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      console.error('Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
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

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
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
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation - Full width distribution */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1">
              {visibleNavItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      isActive(item.path)
                        ? 'text-primary bg-primary/10 shadow-sm'
                        : 'text-foreground hover:text-primary hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xl:inline whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* More Dropdown for additional items */}
              {visibleNavItems.length > 4 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="px-3 py-2 text-foreground hover:text-primary hover:bg-accent transition-all duration-200"
                    >
                      <Menu className="h-4 w-4" />
                      <span className="hidden xl:inline ml-1.5">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-popover shadow-xl border border-border z-50">
                    {visibleNavItems.slice(4).map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link
                            to={item.path}
                            className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                              isActive(item.path) ? 'text-primary bg-primary/10' : 'hover:text-primary text-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
            
            {/* Right Side Actions - Optimized */}
            <div className="flex items-center space-x-2">
              {user && (
                <>
                  {/* User Role Selector - Compact */}
                  <div className="hidden sm:block">
                    <UserRoleSelector />
                  </div>
                  
                   {/* Theme Toggle */}
                   <ThemeToggleButton />
                   
                   {/* Notifications - Always visible */}
                   <NotificationDropdown />
                  
                  {/* Quick Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hidden md:flex items-center space-x-1.5 text-foreground hover:text-primary hover:bg-accent transition-all duration-200 hover:scale-105 px-2.5"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="hidden lg:inline">Settings</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover shadow-xl border border-border z-50">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/system')}>
                        <Settings className="h-4 w-4 mr-2" />
                        System Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* User Avatar with Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-9 w-9 rounded-full bg-gradient-to-br from-muted to-accent hover:from-accent hover:to-muted flex items-center justify-center transition-all duration-200 hover:shadow-md hover:scale-105"
                      >
                        <span className="font-semibold text-foreground text-xs">{getUserInitials()}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 mr-4 mt-2 border-0 shadow-xl bg-popover backdrop-blur-md z-50">
                      <div className="p-4">
                        <div className="flex flex-col space-y-2">
                          <p className="text-base font-semibold leading-none text-foreground">
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-sm leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                          {profile?.organization && (
                            <p className="text-xs leading-none text-muted-foreground bg-muted px-2 py-1 rounded-md inline-block">
                              {profile.organization}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground capitalize">
                            Role: {role}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator className="bg-border" />
                      
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile Management
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/system')}>
                        <Settings className="h-4 w-4 mr-2" />
                        System Settings
                      </DropdownMenuItem>
                      
                      {role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => setAccountTypeModalOpen(true)}>
                        <UserCog className="h-4 w-4 mr-2" />
                        Change Account Type
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
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
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
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
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                    Login / Register
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button - Compact */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border shadow-lg transition-colors duration-300">
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
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {user && (
              <>
                <div className="border-t border-border pt-4 mt-4">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    disabled={isSigningOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              </>
            )}
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
