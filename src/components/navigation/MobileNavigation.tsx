
import React from 'react';
import { Button } from "@/components/ui/button";
import { MainNavigation } from './MainNavigation';
import { UserMenu } from './UserMenu';
import { useUserRole } from "@/contexts/UserRoleContext";

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
  onClose: () => void;
  onChangeAccountType: () => void;
}

export const MobileNavigation = ({ 
  mobileMenuOpen, 
  onClose,
  onChangeAccountType 
}: MobileNavigationProps) => {
  const { role } = useUserRole();

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 bg-black text-white z-20 pt-16 px-4 pb-4 flex flex-col">
      <div className="flex items-center justify-end p-4">
        <Button
          variant="ghost"
          className="text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      
      <MainNavigation />
      
      <div className="mt-auto">
        <UserMenu onChangeAccountType={onChangeAccountType} />
      </div>
    </div>
  );
};
