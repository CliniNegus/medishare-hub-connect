
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
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
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { role } = useUserRole();
  const { user } = useAuth();
  
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    return `flex items-center px-4 py-2 mt-2 text-sm transition-colors duration-200 ${
      isActive(path)
        ? 'text-white bg-red-600 rounded-md'
        : 'text-gray-800 hover:text-white hover:bg-red-500 rounded-md'
    }`;
  };

  return (
    <div className="h-screen fixed top-0 left-0 w-64 bg-white border-r border-gray-200 pt-16 hidden md:block">
      <div className="flex flex-col px-4 py-4">
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

        {['admin', 'manufacturer'].includes(role) && (
          <Link to="/tracking" className={getLinkClass('/tracking')}>
            <Activity className="mr-3 h-5 w-5" />
            Equipment Tracking
          </Link>
        )}

        {['admin', 'manufacturer'].includes(role) && (
          <Link to="/products" className={getLinkClass('/products')}>
            <Cpu className="mr-3 h-5 w-5" />
            Products
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

        {role === 'admin' && (
          <Link to="/admin" className={getLinkClass('/admin')}>
            <Shield className="mr-3 h-5 w-5" />
            Admin
          </Link>
        )}

        <Link to="/profile" className={getLinkClass('/profile')}>
          <User className="mr-3 h-5 w-5" />
          Profile
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
