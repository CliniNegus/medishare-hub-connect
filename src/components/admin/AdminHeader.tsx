
import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  return (
    <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="font-medium text-gray-600">AB</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
