
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserRole = 'hospital' | 'manufacturer' | 'investor' | 'admin';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  updateUserRole: (newRole: UserRole) => Promise<void>;
  isRoleAuthorized: (allowedRoles: UserRole[]) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('hospital');
  const { profile, user, refreshProfile } = useAuth();
  
  // Set role from profile when it loads
  useEffect(() => {
    if (profile?.role) {
      setRole(profile.role as UserRole);
    }
  }, [profile]);

  // Function to update user role in database
  const updateUserRole = async (newRole: UserRole) => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setRole(newRole);
      
      // Refresh profile to get updated data
      await refreshProfile();
      
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  // Function to check if the current role is authorized
  const isRoleAuthorized = (allowedRoles: UserRole[]): boolean => {
    return allowedRoles.includes(role);
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, updateUserRole, isRoleAuthorized }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
