import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, TrendingUp, Package, Users, MapPin, 
  DollarSign, Settings, LogOut, Briefcase,
  Activity, BarChart3, HelpCircle, FileText
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';

interface MainAppSidebarProps {
  onChangeAccountType: () => void;
}

export function MainAppSidebar({ onChangeAccountType }: MainAppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/dashboard',
      description: 'Overview and analytics'
    },
    { 
      id: 'equipment', 
      label: 'Equipment', 
      icon: Package, 
      path: '/equipment',
      description: 'Browse and manage equipment'
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: TrendingUp, 
      path: '/marketplace',
      description: 'Buy and sell equipment'
    },
    ...(profile?.role === 'hospital' ? [
      { 
        id: 'hospitals', 
        label: 'Hospitals', 
        icon: MapPin, 
        path: '/hospitals',
        description: 'Hospital network'
      }
    ] : []),
    ...(profile?.role === 'investor' ? [
      { 
        id: 'investments', 
        label: 'Investments', 
        icon: Briefcase, 
        path: '/investments',
        description: 'Investment portfolio'
      }
    ] : []),
    ...(profile?.role === 'manufacturer' ? [
      { 
        id: 'analytics', 
        label: 'Analytics', 
        icon: BarChart3, 
        path: '/analytics',
        description: 'Performance metrics'
      }
    ] : []),
  ];

  const secondaryItems = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: Users, 
      action: () => navigate('/profile'),
      description: 'Account settings'
    },
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      icon: Settings, 
      action: () => navigate('/admin'),
      description: 'Administrative tools',
      condition: profile?.role === 'admin'
    },
    { 
      id: 'change-role', 
      label: 'Change Role', 
      icon: Users, 
      action: onChangeAccountType,
      description: 'Switch account type'
    },
    { 
      id: 'help', 
      label: 'Help & Support', 
      icon: HelpCircle, 
      action: () => navigate('/help'),
      description: 'Get assistance'
    },
    { 
      id: 'logout', 
      label: 'Sign Out', 
      icon: LogOut, 
      action: signOut,
      description: 'Exit application'
    },
  ].filter(item => !item.condition || item.condition);

  const handleNavigation = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hospital': return 'bg-blue-100 text-blue-800';
      case 'manufacturer': return 'bg-green-100 text-green-800';
      case 'investor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#E02020] rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          {state === 'expanded' && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#333333] truncate">CliniBuilds</h2>
              {profile && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(profile.role)}`}>
                    {profile.role}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 uppercase tracking-wider text-xs font-medium mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    className="text-[#333333] hover:bg-gray-100 data-[active=true]:bg-[#E02020] data-[active=true]:text-white"
                    tooltip={state === 'collapsed' ? item.description : undefined}
                  >
                    <NavLink to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {state === 'expanded' && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-gray-200">
        <SidebarMenu>
          {secondaryItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                className="text-gray-600 hover:text-[#333333] hover:bg-gray-100"
                onClick={() => handleNavigation(item)}
                tooltip={state === 'collapsed' ? item.description : undefined}
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