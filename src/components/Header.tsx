
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Settings, UserCircle } from "lucide-react";
import UserRoleSelector from './UserRoleSelector';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md medical-gradient"></div>
          <h1 className="text-xl font-bold text-medical-primary">MediShare Hub</h1>
        </div>
        
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
