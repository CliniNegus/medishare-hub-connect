import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, AppRole } from './AuthContext';

export type UserRole = AppRole;

interface UserRoleContextType {
  role: UserRole | null;
  currentRole: UserRole | null;
  setRole: (role: UserRole) => void;
  setCurrentRole: (role: UserRole) => void;
  updateUserRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
  canSwitchRole: boolean;
  profile: any;
  userRoles: UserRole[];
  isAdmin: boolean;
  isUserRegisteredAs: (role: UserRole) => boolean;
  isRoleAuthorized: (requiredRole?: UserRole | UserRole[]) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const { user, profile, userRoles: authUserRoles, updateUserRole: authUpdateUserRole, hasRole: authHasRole } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use the primary role from user_roles table
    if (authUserRoles.primaryRole) {
      setCurrentRole(authUserRoles.primaryRole);
      setIsLoading(false);
    } else if (profile?.role) {
      // Fallback to profile.role for backwards compatibility
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
  }, [user, profile, authUserRoles.primaryRole]);

  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleUpdateUserRole = async (role: UserRole) => {
    try {
      await authUpdateUserRole(role);
      setCurrentRole(role);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  // Check if user has a specific role using the user_roles table
  const isUserRegisteredAs = (role: UserRole): boolean => {
    return authUserRoles.roles.includes(role) || profile?.role === role;
  };

  // Check if user is authorized for a specific role or set of roles
  const isRoleAuthorized = (requiredRole?: UserRole | UserRole[]): boolean => {
    if (!requiredRole) return true;
    
    // Admins can access everything
    if (authUserRoles.isAdmin) return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(r => authUserRoles.roles.includes(r) || profile?.role === r);
    }
    return authUserRoles.roles.includes(requiredRole) || profile?.role === requiredRole;
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return authHasRole(role);
  };

  // Users can only "switch" to their actual role or admin can switch to any role
  const canSwitchRole = authUserRoles.isAdmin;

  const value: UserRoleContextType = {
    role: currentRole,
    currentRole,
    setRole: handleSetRole,
    setCurrentRole: handleSetCurrentRole,
    updateUserRole: handleUpdateUserRole,
    isLoading,
    canSwitchRole,
    profile,
    userRoles: authUserRoles.roles,
    isAdmin: authUserRoles.isAdmin,
    isUserRegisteredAs,
    isRoleAuthorized,
    hasRole,
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
