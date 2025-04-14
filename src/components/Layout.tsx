
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calculator, 
  FileText,
  Settings,
  Signal,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/contexts/UserRoleContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  
  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
      { icon: <ShoppingCart className="h-5 w-5" />, label: 'Shop', path: '/shop' },
    ];
    
    const roleSpecificItems = {
      hospital: [
        { icon: <Package className="h-5 w-5" />, label: 'Inventory', path: '/inventory' },
        { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
        { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
      ],
      manufacturer: [
        { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/inventory' },
        { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
        { icon: <Signal className="h-5 w-5" />, label: 'Tracking', path: '/tracking' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
      ],
      investor: [
        { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
      ],
      admin: [
        { icon: <Package className="h-5 w-5" />, label: 'Inventory', path: '/inventory' },
        { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
        { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
        { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
        { icon: <Signal className="h-5 w-5" />, label: 'Tracking', path: '/tracking' },
      ],
    };
    
    return [...baseItems, ...(roleSpecificItems[role] || [])];
  };
  
  const menuItems = getMenuItems();
  
  if (!user) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-black text-white border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500">MediShare</h1>
          <p className="text-xs text-gray-400 mt-1">Equipment Management Platform</p>
          {role && <div className="text-xs font-semibold mt-1 py-1 px-2 bg-red-600 rounded-md">{role.toUpperCase()}</div>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === item.path 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          {role === 'admin' && (
            <Button
              variant="outline"
              className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-5 w-5" />
              <span className="ml-3">Admin</span>
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mt-2"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
