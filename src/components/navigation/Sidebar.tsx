
import React from 'react';
import { useUserRole } from "@/contexts/UserRoleContext";
import { MainNavigation } from './MainNavigation';
import { UserMenu } from './UserMenu';

interface SidebarProps {
  onChangeAccountType: () => void;
}

export const Sidebar = ({ onChangeAccountType }: SidebarProps) => {
  const { role } = useUserRole();

  return (
    <div className="hidden md:flex w-64 flex-col bg-black text-white border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-red-500">MediShare</h1>
        <p className="text-xs text-gray-400 mt-1">Equipment Management Platform</p>
        {role && <div className="text-xs font-semibold mt-1 py-1 px-2 bg-red-600 rounded-md">{role.toUpperCase()}</div>}
      </div>
      
      <MainNavigation />
      
      <UserMenu onChangeAccountType={onChangeAccountType} />
    </div>
  );
};
