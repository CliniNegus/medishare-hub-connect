
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserRole = 'hospital' | 'manufacturer' | 'investor' | 'admin';

interface UserRoleContextType {
  role: UserRole;
  profile: any;
  setRole: (role: UserRole) => void;
  updateUserRole: (newRole: UserRole) => Promise<void>;
  isRoleAuthorized: (allowedRoles: UserRole[]) => boolean;
  isUserRegisteredAs: (role: UserRole) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('hospital');
  const { profile, user, refreshProfile, updateProfileRole } = useAuth();
  
  // Set role from profile when it loads
  useEffect(() => {
    if (profile?.role) {
      // Make sure we set the role in state to match the user's profile role
      setRole(profile.role as UserRole);
      console.log("Setting user role from profile:", profile.role);
    }
  }, [profile]);

  // Function to check if the user is registered with a specific role
  const isUserRegisteredAs = (checkRole: UserRole): boolean => {
    return profile?.role === checkRole;
  };

  // Function to update user role in database
  const updateUserRole = async (newRole: UserRole) => {
    if (!user) return;
    
    try {
      await updateProfileRole(newRole);
      
      // Update local state
      setRole(newRole);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  // Function to check if the current role is authorized
  const isRoleAuthorized = (allowedRoles: UserRole[]): boolean => {
    // If user is registered as admin, allow access to everything
    if (profile?.role === 'admin') {
      return true;
    }
    
    // Check if the user's registered role is in allowed roles
    // This ensures users can only access what their registered role allows
    return profile?.role && allowedRoles.includes(profile.role as UserRole);
  };

  return (
    <UserRoleContext.Provider value={{ 
      role, 
      profile,
      setRole, 
      updateUserRole, 
      isRoleAuthorized,
      isUserRegisteredAs
    }}>
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
