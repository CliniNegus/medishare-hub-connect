import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Hospital, Factory, PiggyBank, ChevronDown, ShieldAlert } from "lucide-react";
import { useUserRole, UserRole } from '@/contexts/UserRoleContext';
import { useToast } from "@/components/ui/use-toast";

const UserRoleSelector = () => {
  const { role, setRole, updateUserRole, userRoles, isAdmin } = useUserRole();
  const { toast } = useToast();

  const roleIcons = {
    hospital: <Hospital className="h-4 w-4 mr-2" />,
    manufacturer: <Factory className="h-4 w-4 mr-2" />,
    investor: <PiggyBank className="h-4 w-4 mr-2" />,
    admin: <ShieldAlert className="h-4 w-4 mr-2" />
  };

  const roleLabels = {
    hospital: 'Hospital',
    manufacturer: 'Manufacturer',
    investor: 'Investor',
    admin: 'Admin'
  };

  const handleRoleChange = async (newRole: UserRole) => {
    // Admins can switch to any role
    if (isAdmin) {
      setRole(newRole);
      toast({
        title: "View Changed",
        description: `You are now viewing as ${roleLabels[newRole]}.`,
      });
      return;
    }
    
    // Check if user has this role in the user_roles table
    if (!userRoles.includes(newRole)) {
      toast({
        title: "Access Restricted",
        description: `You are not registered as a ${roleLabels[newRole]}. You cannot access ${roleLabels[newRole]} features.`,
        variant: "destructive"
      });
      return;
    }
    
    // User has the role, allow switching
    setRole(newRole);
  };

  // Available roles based on what the user has in user_roles table
  const availableRoles: UserRole[] = isAdmin 
    ? ['hospital', 'manufacturer', 'investor', 'admin']
    : userRoles.length > 0 
      ? userRoles 
      : ['hospital', 'manufacturer', 'investor'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          {roleIcons[role]}
          <span>{roleLabels[role]} View</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        {availableRoles.map((availableRole) => (
          <DropdownMenuItem 
            key={availableRole}
            onClick={() => handleRoleChange(availableRole)} 
            className="cursor-pointer"
          >
            {roleIcons[availableRole]}
            <span>{roleLabels[availableRole]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserRoleSelector;
