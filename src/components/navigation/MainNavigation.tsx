
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calculator, 
  FileText,
  Signal
} from 'lucide-react';
import { useUserRole } from "@/contexts/UserRoleContext";

export const MainNavigation = () => {
  const { role } = useUserRole();
  
  const getMenuItems = () => {
    const baseItems = [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
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

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md p-2"
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
