import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Settings, UserCircle, Package, ShoppingCart, Home, Calculator, LayoutDashboard, LogOut, Trash2, UserCog } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  
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

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-r from-red-600 to-black"></div>
            <h1 className="text-xl font-bold ml-2">CliniBuilds</h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className={`flex items-center text-sm font-medium ${isActive('/dashboard') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          
          {(role === 'hospital' || role === 'admin' || role === 'manufacturer') && (
            <Link to="/inventory" className={`flex items-center text-sm font-medium ${isActive('/inventory') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Link>
          )}
          
          {(role === 'hospital' || role === 'admin' || role === 'manufacturer') && (
            <Link to="/orders" className={`flex items-center text-sm font-medium ${isActive('/orders') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Link>
          )}
          
          {(role === 'hospital' || role === 'admin' || role === 'investor') && (
            <Link to="/financing" className={`flex items-center text-sm font-medium ${isActive('/financing') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
              <Calculator className="h-4 w-4 mr-2" />
              Financing
            </Link>
          )}
          
          {role === 'admin' && (
            <Link to="/admin" className={`flex items-center text-sm font-medium ${isActive('/admin') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Admin
            </Link>
          )}
          
          <Link to="/shop" className={`flex items-center text-sm font-medium ${isActive('/shop') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Shop
          </Link>
        </nav>
        
        {user && <UserRoleSelector />}
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <NotificationDropdown />
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
            </>
          )}
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <UserCircle className="h-5 w-5" />
                <span>{role}</span>
              </Button>
              
              <div className="relative group">
                <Button variant="ghost" className="text-red-600">
                  <LogOut className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <button
                    onClick={() => setAccountTypeModalOpen(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <UserCog className="h-4 w-4 mr-2 text-gray-500" />
                      Change Account Type
                    </div>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                      Sign Out
                    </div>
                  </button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <div className="flex items-center">
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          Delete Account
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
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
                </div>
              </div>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700">
                Login / Register
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Account Type Change Modal */}
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen} 
        onOpenChange={setAccountTypeModalOpen} 
      />
    </header>
  );
};

export default Header;
