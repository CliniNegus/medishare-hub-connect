
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bell, Settings, UserCircle, Package, ShoppingCart, Home, Calculator, LayoutDashboard } from "lucide-react";
import UserRoleSelector from './UserRoleSelector';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { role } = useUserRole();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
        </nav>
        
        {user && <UserRoleSelector />}
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
            </>
          )}
          
          {user ? (
            <Button variant="outline" className="flex items-center space-x-2">
              <UserCircle className="h-5 w-5" />
              <span>{role}</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700">
                Login / Register
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
