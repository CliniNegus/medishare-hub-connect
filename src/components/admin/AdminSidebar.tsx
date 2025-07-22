
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, Bell, Calendar, Settings, 
  FileText, BarChart2, Clock, DollarSign, LogOut, Home
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart2 },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Clock },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'shop', label: 'Medical Shop', icon: Package },
  ];

  const secondaryItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { action: () => navigate('/dashboard'), label: 'User Dashboard', icon: Home },
    { action: () => navigate('/'), label: 'Sign Out', icon: LogOut },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-[#333333] to-black text-white h-screen fixed left-0 top-0 z-20 shadow-2xl">
      {/* Logo Section with enhanced design */}
      <div className="relative p-6 border-b border-gray-700/30 bg-gradient-to-br from-[#E02020]/20 via-black/20 to-[#333333]/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E02020]/5 to-transparent" />
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#E02020]/10 to-transparent rounded-full blur-xl" />
        <div className="relative flex items-center justify-center">
          <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/10 mr-3">
            <img 
              src="/lovable-uploads/661de53b-e7ab-4711-97b0-ac4cf9c089f0.png" 
              alt="Clinibuilds Logo" 
              className="h-8 w-auto"
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-tight">CliniBuilds</h1>
            <p className="text-xs text-[#E02020] font-medium bg-gradient-to-r from-[#E02020] to-red-300 bg-clip-text text-transparent">
              Admin Panel
            </p>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-[#E02020] to-red-400 rounded-full animate-pulse" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#E02020] to-[#c01010] text-white shadow-lg transform scale-105' 
                    : 'hover:bg-white/10 text-gray-300 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="pt-8 mt-8 border-t border-gray-700/50">
          <div className="space-y-2">
            {secondaryItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = 'id' in item && activeTab === item.id;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if ('action' in item) {
                      item.action();
                    } else if ('id' in item) {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#E02020] to-[#c01010] text-white shadow-lg' 
                      : 'hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom decoration */}
      <div className="p-4">
        <div className="h-1 bg-gradient-to-r from-[#E02020] to-[#c01010] rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default AdminSidebar;
