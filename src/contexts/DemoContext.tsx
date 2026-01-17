import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  isDemoUser, 
  DEMO_MANUFACTURER_DATA, 
  DEMO_HOSPITAL_DATA, 
  DEMO_INVESTOR_DATA 
} from '@/data/demoData';

interface DemoContextType {
  isDemoMode: boolean;
  demoManufacturerData: typeof DEMO_MANUFACTURER_DATA;
  demoHospitalData: typeof DEMO_HOSPITAL_DATA;
  demoInvestorData: typeof DEMO_INVESTOR_DATA;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const isDemoMode = useMemo(() => {
    return isDemoUser(user?.email);
  }, [user?.email]);

  const value = useMemo(() => ({
    isDemoMode,
    demoManufacturerData: DEMO_MANUFACTURER_DATA,
    demoHospitalData: DEMO_HOSPITAL_DATA,
    demoInvestorData: DEMO_INVESTOR_DATA,
  }), [isDemoMode]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
