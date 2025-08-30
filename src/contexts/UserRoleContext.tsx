import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserRole = 'hospital' | 'manufacturer' | 'investor' | 'admin';

interface UserRoleContextType {
  role: UserRole | null;
  currentRole: UserRole | null;
  setRole: (role: UserRole) => void;
  setCurrentRole: (role: UserRole) => void;
  updateUserRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
  canSwitchRole: boolean;
  profile: any; // This will come from auth context
  isUserRegisteredAs: (role: UserRole) => boolean;
  isRoleAuthorized: (requiredRole?: UserRole | UserRole[]) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const { user, profile, updateProfileRole } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.role) {
      setCurrentRole(profile.role as UserRole);
      setIsLoading(false);
    } else if (user && !profile) {
      // User exists but no profile loaded yet
      setIsLoading(true);
    } else if (!user) {
      // No user logged in
      setCurrentRole(null);
      setIsLoading(false);
    }
  }, [user, profile]);

  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleUpdateUserRole = async (role: UserRole) => {
    try {
      if (updateProfileRole) {
        await updateProfileRole(role);
        setCurrentRole(role);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const isUserRegisteredAs = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const isRoleAuthorized = (requiredRole?: UserRole | UserRole[]): boolean => {
    if (!requiredRole) return true;
    if (profile?.role === 'admin') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(profile?.role as UserRole);
    }
    return profile?.role === requiredRole;
  };

  // Users can only "switch" to their actual role or admin can switch to any role
  const canSwitchRole = profile?.role === 'admin';

  const value: UserRoleContextType = {
    role: currentRole,
    currentRole,
    setRole: handleSetRole,
    setCurrentRole: handleSetCurrentRole,
    updateUserRole: handleUpdateUserRole,
    isLoading,
    canSwitchRole,
    profile,
    isUserRegisteredAs,
    isRoleAuthorized,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};