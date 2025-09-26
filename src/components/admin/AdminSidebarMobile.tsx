import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, Bell, Calendar, Settings, 
  FileText, BarChart2, Clock, DollarSign, LogOut, Home, ChevronDown, ChevronRight, Receipt
} from 'lucide-react';
import { MobileHamburgerMenu } from '@/components/responsive';

interface AdminSidebarMobileProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebarMobile = ({ activeTab, setActiveTab }: AdminSidebarMobileProps) => {
  const navigate = useNavigate();
  const [financeSubmenuOpen, setFinanceSubmenuOpen] = useState(false);

  // Auto-open finance submenu when customer-statements is active
  useEffect(() => {
    if (activeTab === 'customer-statements') {
      setFinanceSubmenuOpen(true);
    }
  }, [activeTab]);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart2 },
    { id: 'equipment', label: 'Equipment & Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Clock },
    { 
      id: 'finance', 
      label: 'Finance', 
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { id: 'finance', label: 'Transactions', icon: DollarSign },
        { id: 'customer-statements', label: 'Customer Statements', icon: Receipt }
      ]
    },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const secondaryItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { action: () => navigate('/dashboard'), label: 'User Dashboard', icon: Home },
    { action: () => navigate('/'), label: 'Sign Out', icon: LogOut },
  ];

  return (
    <MobileHamburgerMenu className="text-white">
      <div className="bg-gradient-to-b from-[#333333] to-black text-white rounded-lg p-4">
        {/* Logo Section */}
        <div className="mb-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/661de53b-e7ab-4711-97b0-ac4cf9c089f0.png" 
              alt="Clinibuilds Logo" 
              className="h-8 w-auto mr-3"
            />
            <div>
              <h1 className="text-lg font-bold text-white">CliniBuilds</h1>
              <p className="text-xs text-gray-300">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.hasSubmenu && item.submenu?.some(sub => sub.id === activeTab));
            const isSubmenuOpen = item.id === 'finance' && financeSubmenuOpen;
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setFinanceSubmenuOpen(!financeSubmenuOpen);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#E02020] to-[#c01010] text-white shadow-lg' 
                      : 'hover:bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && (
                    <div>
                      {isSubmenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>
                
                {item.hasSubmenu && isSubmenuOpen && (
                  <div className="mt-2 ml-6 space-y-1">
                    {item.submenu?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeTab === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id)}
                          className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 text-sm ${
                            isSubActive 
                              ? 'bg-[#E02020] text-white shadow-md' 
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <SubIcon className="h-4 w-4 mr-3" />
                          <span className="font-medium">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="pt-4 border-t border-gray-700/50">
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
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </MobileHamburgerMenu>
  );
};

export default AdminSidebarMobile;