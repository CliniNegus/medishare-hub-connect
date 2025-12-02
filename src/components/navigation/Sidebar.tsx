import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Home,
  Package,
  ShoppingBag,
  DollarSign,
  FileText,
  Map,
  Cpu,
  Settings,
  Store,
  Shield,
  Users,
  Activity,
  User,
  LogOut,
  UserCog,
  Heart,
  HelpCircle,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface SidebarProps {
  onChangeAccountType?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChangeAccountType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    return `flex items-center px-4 py-2 mt-2 text-sm transition-colors duration-200 ${
      isActive(path)
        ? 'text-white bg-[#E02020] rounded-md shadow-sm'
        : 'text-gray-800 hover:text-white hover:bg-[#E02020] rounded-md'
    }`;
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      console.log('Starting sign out process from sidebar...');
      
      await signOut();
      navigate('/auth');
      
      console.log('Sign out completed successfully from sidebar');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      console.error('Error during sign out from sidebar:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing you out. Please try again.",
        variant: "destructive",
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
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="h-screen fixed top-0 left-0 w-64 bg-white border-r border-gray-200 pt-16 hidden md:flex flex-col z-10">
      {/* Logo Section */}
      <div className="px-4 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/661de53b-e7ab-4711-97b0-ac4cf9c089f0.png" 
            alt="Clinibuilds Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-lg font-bold text-[#333333]">CliniBuilds</h1>
            <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </Link>

        {['admin', 'hospital'].includes(role) && (
          <Link to="/inventory" className={getLinkClass('/inventory')}>
            <Package className="mr-3 h-5 w-5" />
            Inventory
          </Link>
        )}

        {['admin', 'hospital', 'manufacturer'].includes(role) && (
          <Link to="/orders" className={getLinkClass('/orders')}>
            <ShoppingBag className="mr-3 h-5 w-5" />
            Orders
          </Link>
        )}

        {['admin', 'hospital', 'investor'].includes(role) && (
          <Link to="/financing" className={getLinkClass('/financing')}>
            <DollarSign className="mr-3 h-5 w-5" />
            Financing
          </Link>
        )}

        {['admin', 'hospital', 'manufacturer', 'investor'].includes(role) && (
          <Link to="/leases" className={getLinkClass('/leases')}>
            <FileText className="mr-3 h-5 w-5" />
            Leases
          </Link>
        )}

        {['admin'].includes(role) && (
          <Link to="/hospital-locations" className={getLinkClass('/hospital-locations')}>
            <Map className="mr-3 h-5 w-5" />
            Hospital Locations
          </Link>
        )}

        {/* Equipment section for all roles */}
        {['admin', 'hospital', 'manufacturer', 'investor'].includes(role) && (
          <Link to="/equipment" className={getLinkClass('/equipment')}>
            <Package className="mr-3 h-5 w-5" />
            Equipment
          </Link>
        )}

        {['admin', 'manufacturer'].includes(role) && (
          <Link to="/tracking" className={getLinkClass('/tracking')}>
            <Activity className="mr-3 h-5 w-5" />
            Equipment Tracking
          </Link>
        )}

        {['admin', 'manufacturer'].includes(role) && (
          <Link to="/analytics" className={getLinkClass('/analytics')}>
            <BarChart3 className="mr-3 h-5 w-5" />
            Analytics
          </Link>
        )}

        {['admin', 'manufacturer'].includes(role) && (
          <Link to="/manufacturer/products" className={getLinkClass('/manufacturer/products')}>
            <Package className="mr-3 h-5 w-5" />
            Products
          </Link>
        )}

        {['hospital'].includes(role) && (
          <Link to="/products" className={getLinkClass('/products')}>
            <Cpu className="mr-3 h-5 w-5" />
            Products
          </Link>
        )}

        {['hospital'].includes(role) && (
          <Link to="/wishlist" className={getLinkClass('/wishlist')}>
            <Heart className="mr-3 h-5 w-5" />
            Wishlist
          </Link>
        )}

        {['admin', 'manufacturer'].includes(role) && (
          <Link to="/virtual-shops" className={getLinkClass('/virtual-shops')}>
            <Store className="mr-3 h-5 w-5" />
            Virtual Shops
          </Link>
        )}

        {['admin', 'hospital', 'manufacturer'].includes(role) && (
          <Link to="/clients" className={getLinkClass('/clients')}>
            <Users className="mr-3 h-5 w-5" />
            Clients
          </Link>
        )}

        <Link to="/shop" className={getLinkClass('/shop')}>
          <ShoppingBag className="mr-3 h-5 w-5" />
          Shop
        </Link>

        {['admin', 'hospital', 'manufacturer', 'investor'].includes(role) && (
          <Link to="/system" className={getLinkClass('/system')}>
            <Settings className="mr-3 h-5 w-5" />
            System
          </Link>
        )}

        <Link to="/help" className={getLinkClass('/help')}>
          <HelpCircle className="mr-3 h-5 w-5" />
          Help & Support
        </Link>

        {role === 'admin' && (
          <Link to="/admin" className={getLinkClass('/admin')}>
            <Shield className="mr-3 h-5 w-5" />
            Admin
          </Link>
        )}
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3 px-2 py-2 bg-gray-50 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E02020] to-[#B91C1C] flex items-center justify-center text-white text-xs font-semibold">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {role}
            </p>
          </div>
        </div>

        {/* Profile & Settings */}
        <Link to="/profile" className={getLinkClass('/profile')}>
          <User className="mr-3 h-5 w-5" />
          Profile
        </Link>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangeAccountType}
            className="w-full justify-start text-gray-700 hover:text-[#E02020] hover:bg-red-50"
          >
            <UserCog className="mr-3 h-4 w-4" />
            Change Account Type
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full justify-start text-gray-700 hover:text-[#E02020] hover:bg-red-50"
          >
            <LogOut className="mr-3 h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
