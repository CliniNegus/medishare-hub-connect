
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import MobileNavigation from './navigation/MobileNavigation';
import FloatingActionButton from './FloatingActionButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { HelpBar } from './help/HelpBar';
import { TutorialProvider } from '@/contexts/TutorialContext';
import RoleDashboardTutorial from './tutorials/RoleDashboardTutorial';
import NotificationSystemInitializer from './notifications/NotificationSystemInitializer';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { MainAppSidebar } from './navigation/MainAppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  
  if (!user) {
    return <>{children}</>;
  }
  
  return (
    <TutorialProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-[#FFFFFF] overflow-x-hidden">
          <MainAppSidebar onChangeAccountType={() => setAccountTypeModalOpen(true)} />
          <SidebarInset>
            <header className="flex h-16 items-center px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <SidebarTrigger />
              <div className="flex-1 flex justify-between items-center ml-4">
                <h1 className="text-xl font-bold text-[#E02020] sm:block hidden">CliniBuilds</h1>
                <div className="flex items-center space-x-2">
                  {user && <HelpBar />}
                  {user && <FloatingActionButton />}
                </div>
              </div>
            </header>
            
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#FFFFFF] max-w-full">
              <div className="max-w-full overflow-x-hidden p-4 sm:p-6">
                {children}
              </div>
            </main>
          </SidebarInset>
          
          <ChangeAccountTypeModal 
            open={accountTypeModalOpen} 
            onOpenChange={setAccountTypeModalOpen} 
          />
          
          {user && <NotificationSystemInitializer />}
          
          <RoleDashboardTutorial />
        </div>
      </SidebarProvider>
    </TutorialProvider>
  );
};

export default Layout;
