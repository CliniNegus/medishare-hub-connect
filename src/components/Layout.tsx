
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calculator, 
  FileText,
  Settings,
  Signal,
  LogOut,
  Trash2,
  UserCog,
  Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/contexts/UserRoleContext";
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
      { icon: <ShoppingCart className="h-5 w-5" />, label: 'Shop', path: '/shop' },
    ];
    
    const roleSpecificItems = {
      hospital: [
        { icon: <Package className="h-5 w-5" />, label: 'Inventory', path: '/inventory' },
        { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
        { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
      ],
      manufacturer: [
        { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/inventory' },
        { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
        { icon: <Signal className="h-5 w-5" />, label: 'Tracking', path: '/tracking' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
      ],
      investor: [
        { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
      ],
      admin: [
        { icon: <Package className="h-5 w-5" />, label: 'Inventory', path: '/inventory' },
        { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
        { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
        { icon: <Signal className="h-5 w-5" />, label: 'Tracking', path: '/tracking' },
      ],
    };
    
    return [...baseItems, ...(roleSpecificItems[role] || [])];
  };
  
  const menuItems = getMenuItems();

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
  
  if (!user) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-black text-white z-30 px-4 py-3 flex justify-between items-center border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500">MediShare</h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-white"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black text-white z-20 pt-16 px-4 pb-4 flex flex-col">
          <nav className="flex-1 overflow-y-auto space-y-2 pt-4">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === item.path 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
          
          <div className="border-t border-gray-800 pt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800"
              onClick={() => {
                navigate('/security-settings');
                setMobileMenuOpen(false);
              }}
            >
              <Shield className="h-5 w-5" />
              <span className="ml-3">Security</span>
            </Button>
            
            {role === 'admin' && (
              <Button
                variant="outline"
                className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800"
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3">Admin</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800"
              onClick={() => {
                setAccountTypeModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <UserCog className="h-5 w-5" />
              <span className="ml-3">Change Account Type</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sign Out</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-400 hover:text-red-300 border-gray-700 hover:bg-gray-800"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="ml-3">Delete Account</span>
                </Button>
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
      )}

      {/* Desktop Sidebar */}
      <div className={`${isMobile ? 'hidden' : 'flex'} w-64 flex-col bg-black text-white border-r border-gray-800`}>
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500">MediShare</h1>
          <p className="text-xs text-gray-400 mt-1">Equipment Management Platform</p>
          {role && <div className="text-xs font-semibold mt-1 py-1 px-2 bg-red-600 rounded-md">{role.toUpperCase()}</div>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === item.path 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mb-2"
            onClick={() => navigate('/security-settings')}
          >
            <Shield className="h-5 w-5" />
            <span className="ml-3">Security</span>
          </Button>
          
          {role === 'admin' && (
            <Button
              variant="outline"
              className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mt-2"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-5 w-5" />
              <span className="ml-3">Admin</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mt-2"
            onClick={() => setAccountTypeModalOpen(true)}
          >
            <UserCog className="h-5 w-5" />
            <span className="ml-3">Change Account Type</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mt-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-red-400 hover:text-red-300 border-gray-700 hover:bg-gray-800 mt-2"
              >
                <Trash2 className="h-5 w-5" />
                <span className="ml-3">Delete Account</span>
              </Button>
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
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className={`flex-1 overflow-y-auto bg-gray-50 ${isMobile ? 'pt-16' : ''}`}>
          {children}
        </main>
      </div>
      
      {/* Account Type Change Modal */}
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen} 
        onOpenChange={setAccountTypeModalOpen} 
      />
    </div>
  );
};
