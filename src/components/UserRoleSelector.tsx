
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
        toast({
          title: "Role Updated",
          description: `Your role has been set to ${roleLabels[newRole]}.`,
        });
      } catch (error) {
        console.error("Failed to update user role:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update your role. Please try again.",
          variant: "destructive"
        });
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
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm"
        >
          <span className="flex items-center">
            {roleIcons[role]}
            <span>{roleLabels[role]} View</span>
          </span>
          <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40 bg-white border border-gray-200 shadow-lg">
        {availableRoles.map((availableRole) => (
          <DropdownMenuItem 
            key={availableRole}
            onClick={() => handleRoleChange(availableRole)} 
            className="cursor-pointer hover:bg-gray-50"
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
