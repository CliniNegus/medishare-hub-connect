
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
    { id: 'equipment', label: 'Equipment & Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Clock },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const secondaryItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { action: () => navigate('/dashboard'), label: 'User Dashboard', icon: Home },
    { action: () => navigate('/'), label: 'Sign Out', icon: LogOut },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-[#333333] to-black text-white h-screen fixed left-0 top-0 z-20 shadow-2xl">
      {/* Logo Section with enhanced design */}
      <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-[#E02020]/10 to-transparent">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/661de53b-e7ab-4711-97b0-ac4cf9c089f0.png" 
            alt="Clinibuilds Logo" 
            className="h-10 w-auto mr-3"
          />
          <div>
            <h1 className="text-xl font-bold text-white">CliniBuilds</h1>
            <p className="text-xs text-gray-300">Admin Panel</p>
          </div>
        </div>
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
