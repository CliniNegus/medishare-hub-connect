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
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const UserRoleSelector = () => {
  const { role, setRole, updateUserRole } = useUserRole();
  const { profile } = useAuth();
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
    if (!profile) return;
    
    if (profile.role === 'admin') {
      setRole(newRole);
      toast({
        title: "View Changed",
        description: `You are now viewing as ${roleLabels[newRole]}.`,
      });
      return;
    }
    
    if (profile.role && profile.role !== newRole) {
      toast({
        title: "Access Restricted",
        description: `You are registered as a ${roleLabels[profile.role as UserRole]}. You cannot access ${roleLabels[newRole]} features.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!profile.role) {
      try {
        await updateUserRole(newRole);
      } catch (error) {
        console.error("Failed to update user role:", error);
      }
    } else {
      setRole(newRole);
    }
  };

  const availableRoles: UserRole[] = profile?.role === 'admin' 
    ? ['hospital', 'manufacturer', 'investor', 'admin']
    : profile?.role 
      ? [profile.role as UserRole] 
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
