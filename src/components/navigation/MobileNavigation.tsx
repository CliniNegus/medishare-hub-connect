
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Menu,
  X,
  Activity,
  Users,
  User,
} from 'lucide-react';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useUserRole();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <Link
              to="/dashboard"
              className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Home className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            {['admin', 'hospital'].includes(role) && (
              <Link
                to="/inventory"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Package className="mr-3 h-5 w-5" />
                <span>Inventory</span>
              </Link>
            )}

            {['admin', 'hospital', 'manufacturer'].includes(role) && (
              <Link
                to="/orders"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                <span>Orders</span>
              </Link>
            )}

            {['admin', 'hospital', 'investor'].includes(role) && (
              <Link
                to="/financing"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <DollarSign className="mr-3 h-5 w-5" />
                <span>Financing</span>
              </Link>
            )}

            {['admin', 'hospital', 'manufacturer', 'investor'].includes(role) && (
              <Link
                to="/leases"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="mr-3 h-5 w-5" />
                <span>Leases</span>
              </Link>
            )}

            {['admin'].includes(role) && (
              <Link
                to="/hospital-locations"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Map className="mr-3 h-5 w-5" />
                <span>Hospital Locations</span>
              </Link>
            )}

            {['admin', 'manufacturer'].includes(role) && (
              <Link
                to="/tracking"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="mr-3 h-5 w-5" />
                <span>Equipment Tracking</span>
              </Link>
            )}

            {['admin', 'manufacturer'].includes(role) && (
              <Link
                to="/products"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Cpu className="mr-3 h-5 w-5" />
                <span>Products</span>
              </Link>
            )}

            {['admin', 'manufacturer'].includes(role) && (
              <Link
                to="/virtual-shops"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Store className="mr-3 h-5 w-5" />
                <span>Virtual Shops</span>
              </Link>
            )}

            {['admin', 'hospital', 'manufacturer'].includes(role) && (
              <Link
                to="/clients"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Clients</span>
              </Link>
            )}

            <Link
              to="/shop"
              className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              <span>Shop</span>
            </Link>

            {['admin', 'hospital', 'manufacturer', 'investor'].includes(role) && (
              <Link
                to="/system"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>System</span>
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="mr-3 h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center w-full py-3 px-4 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3 h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
