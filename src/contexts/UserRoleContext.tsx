
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
      console.log("Setting user role from profile:", profile.role);
      // Make sure we set the role in state to match the user's profile role
      setRole(profile.role as UserRole);
    }
  }, [profile]);

  // Debug effect
  useEffect(() => {
    console.log("UserRoleProvider - Current state:", { 
      userExists: !!user, 
      profileExists: !!profile,
      currentRole: role,
      profileRole: profile?.role
    });
  }, [user, profile, role]);

  // Function to check if the user is registered with a specific role
  const isUserRegisteredAs = (checkRole: UserRole): boolean => {
    const hasRole = profile?.role === checkRole;
    console.log(`Checking if user has role ${checkRole}:`, hasRole, "Current role:", profile?.role);
    return hasRole;
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
    const isAuthorized = profile?.role && allowedRoles.includes(profile.role as UserRole);
    console.log("Role authorization check:", {
      currentRole: profile?.role,
      allowedRoles,
      isAuthorized
    });
    return !!isAuthorized;
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
