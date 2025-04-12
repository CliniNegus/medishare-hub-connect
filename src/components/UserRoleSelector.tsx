
import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Hospital, Factory, PiggyBank, ChevronDown } from "lucide-react";

type UserRole = 'hospital' | 'manufacturer' | 'investor';

const UserRoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('hospital');

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
          {roleIcons[selectedRole]}
          <span>{roleLabels[selectedRole]} View</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        <DropdownMenuItem onClick={() => setSelectedRole('hospital')} className="cursor-pointer">
          <Hospital className="h-4 w-4 mr-2" />
          <span>Hospital</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedRole('manufacturer')} className="cursor-pointer">
          <Factory className="h-4 w-4 mr-2" />
          <span>Manufacturer</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedRole('investor')} className="cursor-pointer">
          <PiggyBank className="h-4 w-4 mr-2" />
          <span>Investor</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserRoleSelector;
