
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bell, Settings, UserCircle, Package, ShoppingCart, Home, Calculator, LayoutDashboard } from "lucide-react";
import UserRoleSelector from './UserRoleSelector';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <h1 className="text-xl font-bold text-medical-primary ml-2">CliniBuilds</h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className={`flex items-center text-sm font-medium ${isActive('/dashboard') ? 'text-medical-primary' : 'text-gray-600 hover:text-medical-primary'}`}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link to="/inventory" className={`flex items-center text-sm font-medium ${isActive('/inventory') ? 'text-medical-primary' : 'text-gray-600 hover:text-medical-primary'}`}>
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </Link>
          <Link to="/orders" className={`flex items-center text-sm font-medium ${isActive('/orders') ? 'text-medical-primary' : 'text-gray-600 hover:text-medical-primary'}`}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </Link>
          <Link to="/financing" className={`flex items-center text-sm font-medium ${isActive('/financing') ? 'text-medical-primary' : 'text-gray-600 hover:text-medical-primary'}`}>
            <Calculator className="h-4 w-4 mr-2" />
            Financing
          </Link>
          <Link to="/admin" className={`flex items-center text-sm font-medium ${isActive('/admin') ? 'text-medical-primary' : 'text-gray-600 hover:text-medical-primary'}`}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Admin
          </Link>
        </nav>
        
        <UserRoleSelector />
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <UserCircle className="h-5 w-5" />
            <span>Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
