
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Hospital, Factory, PiggyBank, ChevronDown } from "lucide-react";
import { useUserRole, UserRole } from '@/contexts/UserRoleContext';

const UserRoleSelector = () => {
  const { role, setRole } = useUserRole();

  const roleIcons = {
    hospital: <Hospital className="h-4 w-4 mr-2" />,
    manufacturer: <Factory className="h-4 w-4 mr-2" />,
    investor: <PiggyBank className="h-4 w-4 mr-2" />
  };

  const roleLabels = {
    hospital: 'Hospital',
    manufacturer: 'Manufacturer',
    investor: 'Investor'
  };

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
        <DropdownMenuItem onClick={() => setRole('hospital')} className="cursor-pointer">
          <Hospital className="h-4 w-4 mr-2" />
          <span>Hospital</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole('manufacturer')} className="cursor-pointer">
          <Factory className="h-4 w-4 mr-2" />
          <span>Manufacturer</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole('investor')} className="cursor-pointer">
          <PiggyBank className="h-4 w-4 mr-2" />
          <span>Investor</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserRoleSelector;
