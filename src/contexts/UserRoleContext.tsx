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
  isImpersonating: boolean;
  impersonatedUser: any;
  setImpersonationData: (data: any) => void;
  clearImpersonation: () => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('hospital');
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);
  const { profile, user, refreshProfile, updateProfileRole } = useAuth();
  
  // Check for impersonation data on mount
  useEffect(() => {
    const impersonationData = sessionStorage.getItem('impersonation_data');
    if (impersonationData) {
      const data = JSON.parse(impersonationData);
      setIsImpersonating(true);
      setImpersonatedUser(data.targetUser);
      setRole(data.targetUser.role as UserRole);
    }
  }, []);
  
  // Set role from profile when it loads (only if not impersonating)
  useEffect(() => {
    if (!isImpersonating && profile?.role) {
      console.log("Setting user role from profile:", profile.role);
      setRole(profile.role as UserRole);
    }
  }, [profile, isImpersonating]);

  // Debug effect
  useEffect(() => {
    console.log("UserRoleProvider - Current state:", { 
      userExists: !!user, 
      profileExists: !!profile,
      currentRole: role,
      profileRole: profile?.role,
      isImpersonating,
      impersonatedUser: impersonatedUser?.email
    });
  }, [user, profile, role, isImpersonating, impersonatedUser]);

  // Function to check if the user is registered with a specific role
  const isUserRegisteredAs = (checkRole: UserRole): boolean => {
    // If impersonating, check against impersonated user's role
    if (isImpersonating && impersonatedUser) {
      return impersonatedUser.role === checkRole;
    }
    
    const hasRole = profile?.role === checkRole;
    console.log(`Checking if user has role ${checkRole}:`, hasRole, "Current role:", profile?.role);
    return hasRole;
  };

  // Function to update user role in database
  const updateUserRole = async (newRole: UserRole) => {
    if (!user || isImpersonating) return; // Don't allow role changes during impersonation
    
    try {
      await updateProfileRole(newRole);
      setRole(newRole);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  // Function to check if the current role is authorized
  const isRoleAuthorized = (allowedRoles: UserRole[]): boolean => {
    // If impersonating, check against impersonated user's role
    if (isImpersonating && impersonatedUser) {
      // Allow admin access even during impersonation for safety
      if (profile?.role === 'admin') {
        return true;
      }
      return allowedRoles.includes(impersonatedUser.role as UserRole);
    }
    
    // If user is registered as admin, allow access to everything
    if (profile?.role === 'admin') {
      return true;
    }
    
    // Check if the user's registered role is in allowed roles
    const isAuthorized = profile?.role && allowedRoles.includes(profile.role as UserRole);
    console.log("Role authorization check:", {
      currentRole: profile?.role,
      allowedRoles,
      isAuthorized,
      isImpersonating
    });
    return !!isAuthorized;
  };

  // Function to set impersonation data
  const setImpersonationData = (data: any) => {
    setIsImpersonating(true);
    setImpersonatedUser(data.targetUser);
    setRole(data.targetUser.role as UserRole);
  };

  // Function to clear impersonation
  const clearImpersonation = () => {
    setIsImpersonating(false);
    setImpersonatedUser(null);
    sessionStorage.removeItem('impersonation_data');
    // Reset to original user's role
    if (profile?.role) {
      setRole(profile.role as UserRole);
    }
  };

  return (
    <UserRoleContext.Provider value={{ 
      role, 
      profile: isImpersonating ? impersonatedUser : profile,
      setRole, 
      updateUserRole, 
      isRoleAuthorized,
      isUserRegisteredAs,
      isImpersonating,
      impersonatedUser,
      setImpersonationData,
      clearImpersonation
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