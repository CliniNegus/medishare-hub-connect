
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calculator, 
  FileText,
  Settings,
  Signal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Package className="h-5 w-5" />, label: 'Inventory', path: '/inventory' },
    { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
    { icon: <FileText className="h-5 w-5" />, label: 'Leases', path: '/leases' },
    { icon: <Signal className="h-5 w-5" />, label: 'Tracking', path: '/tracking' },
    { icon: <Calculator className="h-5 w-5" />, label: 'Financing', path: '/financing' },
  ];
  
  if (!user) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">MediShare</h1>
          <p className="text-xs text-gray-500 mt-1">Equipment Management Platform</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/admin')}
          >
            <Settings className="h-5 w-5" />
            <span className="ml-3">Admin</span>
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
