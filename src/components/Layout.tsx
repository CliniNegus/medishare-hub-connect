
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import Sidebar from './navigation/Sidebar';
import MobileNavigation from './navigation/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { HelpBar } from './help/HelpBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  
  if (!user) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white text-[#333333] z-30 px-4 py-3 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold text-[#E02020]">CliniBuilds</h1>
          <Button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            variant="ghost"
            className="text-[#333333] p-2"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>
      )}

      <Sidebar onChangeAccountType={() => setAccountTypeModalOpen(true)} />
      
      <MobileNavigation 
        mobileMenuOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onChangeAccountType={() => setAccountTypeModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className={`flex-1 overflow-y-auto bg-[#FFFFFF] ${isMobile ? 'pt-16' : ''}`}>
          {children}
        </main>
      </div>
      
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen} 
        onOpenChange={setAccountTypeModalOpen} 
      />
      
      {user && <HelpBar />}
    </div>
  );
};

export default Layout;
