
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  DollarSign, 
  Wrench,
  MessageCircle,
  FileText
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'support', label: 'Support Requests', icon: MessageCircle },
    { id: 'shop', label: 'Shop Management', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-red-600">CliniBuilds</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors",
                activeTab === item.id 
                  ? "bg-red-50 text-red-600 border-r-2 border-red-600" 
                  : "text-gray-700"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
