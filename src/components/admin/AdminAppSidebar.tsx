import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, Package, Bell, Calendar, Settings, 
  FileText, BarChart2, Clock, DollarSign, LogOut, Home, 
  Receipt, ChevronRight, ChevronDown, UserX, ClipboardCheck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';

interface AdminAppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminAppSidebar({ activeTab, setActiveTab }: AdminAppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
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
    { id: 'deletion-requests', label: 'Deletion Requests', icon: UserX },
    { id: 'manufacturer-approvals', label: 'Manufacturer Approvals', icon: ClipboardCheck },
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

  const handleMenuClick = (item: any) => {
    if (item.action) {
      item.action();
      return;
    }

    if (item.hasSubmenu) {
      setFinanceSubmenuOpen(!financeSubmenuOpen);
      return;
    }

    setActiveTab(item.id);
  };

  const handleSubmenuClick = (submenuItem: any) => {
    setActiveTab(submenuItem.id);
  };

  const isActive = (id: string) => activeTab === id;

  return (
    <Sidebar className="bg-gradient-to-b from-[#333333] to-black text-white border-r-0">
      <SidebarHeader className="p-4 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#E02020] rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          {state === 'expanded' && (
            <div>
              <h2 className="text-lg font-bold text-white">CliniBuilds</h2>
              <p className="text-xs text-gray-300">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 uppercase tracking-wider text-xs font-medium mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild={!item.hasSubmenu}
                    isActive={item.hasSubmenu ? (activeTab === 'finance' || activeTab === 'customer-statements') : isActive(item.id)}
                    className="text-white hover:bg-white/10 data-[active=true]:bg-[#E02020] data-[active=true]:text-white"
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.hasSubmenu ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {state === 'expanded' && <span>{item.label}</span>}
                        </div>
                        {state === 'expanded' && (
                          <div className="ml-auto">
                            {financeSubmenuOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {state === 'expanded' && <span>{item.label}</span>}
                      </div>
                    )}
                  </SidebarMenuButton>

                  {item.hasSubmenu && financeSubmenuOpen && state === 'expanded' && (
                    <SidebarMenuSub>
                      {item.submenu?.map((submenuItem) => (
                        <SidebarMenuSubItem key={submenuItem.id}>
                          <SidebarMenuSubButton
                            isActive={isActive(submenuItem.id)}
                            className="text-gray-300 hover:text-white hover:bg-white/10 data-[active=true]:bg-[#E02020] data-[active=true]:text-white"
                            onClick={() => handleSubmenuClick(submenuItem)}
                          >
                            <submenuItem.icon className="h-4 w-4" />
                            <span>{submenuItem.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-gray-600">
        <SidebarMenu>
          {secondaryItems.map((item) => (
            <SidebarMenuItem key={item.id || item.label}>
              <SidebarMenuButton
                className="text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => handleMenuClick(item)}
              >
                <item.icon className="h-4 w-4" />
                {state === 'expanded' && <span>{item.label}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}