import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, TrendingUp, Package, Users, MapPin, 
  DollarSign, LogOut, Briefcase, Bell,
  Activity, BarChart3, HelpCircle, FileText, ShoppingCart, Heart, ClipboardList,
  ArrowLeftRight, Brain, FileSpreadsheet
} from 'lucide-react';
import clinibuildsLogo from '@/assets/clinibuilds_logo.jpg';
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
import { useUserRole } from '@/contexts/UserRoleContext';
import { useNotificationContext } from '@/components/notifications/NotificationProvider';

interface MainAppSidebarProps {
  onChangeAccountType: () => void;
}

export function MainAppSidebar({ onChangeAccountType }: MainAppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();
  const { role: currentRole, hasRole } = useUserRole();
  const { unreadCount } = useNotificationContext();

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
    ...(hasRole('hospital') ? [
      { 
        id: 'products', 
        label: 'Products', 
        icon: ShoppingCart, 
        path: '/products',
        description: 'Medical shop and supplies'
      },
      { 
        id: 'wishlist', 
        label: 'Wishlist', 
        icon: Heart, 
        path: '/wishlist',
        description: 'Saved products'
      },
      { 
        id: 'equipment-sharing', 
        label: 'Equipment Sharing', 
        icon: ArrowLeftRight, 
        path: '/equipment-sharing',
        description: 'Request & share equipment'
      },
      { 
        id: 'demand-forecasting', 
        label: 'Demand Forecast', 
        icon: Brain, 
        path: '/demand-forecasting',
        description: 'AI-powered demand predictions'
      },
      { 
        id: 'hospitals', 
        label: 'Hospitals', 
        icon: MapPin, 
        path: '/hospitals',
        description: 'Hospital network'
      }
    ] : []),
    ...(hasRole('investor') ? [
      { 
        id: 'investments', 
        label: 'Investments', 
        icon: Briefcase, 
        path: '/investments',
        description: 'Investment portfolio'
      }
    ] : []),
    ...(hasRole('manufacturer') ? [
      { 
        id: 'analytics', 
        label: 'Analytics', 
        icon: BarChart3, 
        path: '/analytics',
        description: 'Performance metrics'
      },
      { 
        id: 'products', 
        label: 'Products', 
        icon: Package, 
        path: '/manufacturer/products',
        description: 'Manage your products'
      },
      { 
        id: 'catalog-upload', 
        label: 'Catalog Upload', 
        icon: FileSpreadsheet, 
        path: '/manufacturer/catalog-upload',
        description: 'Bulk upload via CSV'
      },
      { 
        id: 'manufacturer-orders', 
        label: 'Orders', 
        icon: ClipboardList, 
        path: '/manufacturer/orders',
        description: 'Manage customer orders'
      },
      { 
        id: 'notifications', 
        label: 'Notifications', 
        icon: Bell, 
        path: '/notifications',
        description: 'View all notifications',
        badge: unreadCount > 0 ? unreadCount : undefined
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
  ];

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
          <img 
            src={clinibuildsLogo} 
            alt="CliniBuilds Logo" 
            className="h-8 w-auto object-contain"
          />
          {state === 'expanded' && currentRole && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(currentRole)}`}>
                  {currentRole}
                </span>
              </div>
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
              {navigationItems.map((item: any) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    className="text-[#333333] hover:bg-gray-100 data-[active=true]:bg-[#E02020] data-[active=true]:text-white"
                    tooltip={state === 'collapsed' ? item.description : undefined}
                  >
                    <NavLink to={item.path} className="flex items-center gap-2 relative">
                      <item.icon className="h-4 w-4" />
                      {state === 'expanded' && (
                        <span className="flex-1">{item.label}</span>
                      )}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E02020] text-[10px] font-medium text-white">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
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