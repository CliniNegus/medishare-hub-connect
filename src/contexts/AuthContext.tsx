
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type AppRole = 'admin' | 'manufacturer' | 'hospital' | 'investor';

interface UserRolesState {
  roles: AppRole[];
  primaryRole: AppRole | null;
  isAdmin: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  userRoles: UserRolesState;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  updateUserRole: (role: AppRole) => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  setSessionTimeout: (minutes: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [userRoles, setUserRoles] = useState<UserRolesState>({
    roles: [],
    primaryRole: null,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30); // Default 30 minutes
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const { toast } = useToast();

  // Function to reset the activity timer
  const resetActivityTimer = () => {
    setLastActivity(Date.now());
  };

  // Function to update user's last_active timestamp in database
  const updateUserActivity = async () => {
    if (user) {
      try {
        await supabase.rpc('update_user_last_active', { user_uuid: user.id });
      } catch (error) {
        console.error('Error updating user activity:', error);
      }
    }
  };

  // Setup session timeout
  useEffect(() => {
    if (!user) return;

    // Clear any existing timeout
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
    }

    // Convert minutes to milliseconds
    const timeoutMs = sessionTimeoutMinutes * 60 * 1000;

    // Start new timeout
    const id = setTimeout(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;

      // If user has been inactive for longer than the timeout, sign them out
      if (inactiveTime >= timeoutMs) {
        toast({
          title: "Session expired",
          description: "You've been signed out due to inactivity",
        });
        signOut();
      }
    }, timeoutMs);

    setSessionTimeoutId(id);

    // Cleanup on unmount
    return () => {
      if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
      }
    };
  }, [user, sessionTimeoutMinutes, lastActivity]);

  // Setup activity listeners and periodic activity updates
  useEffect(() => {
    if (!user) return;

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetActivityTimer();
      updateUserActivity(); // Update database on activity
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Set up periodic activity updates (every 2 minutes)
    const activityUpdateInterval = setInterval(updateUserActivity, 2 * 60 * 1000);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(activityUpdateInterval);
    };
  }, [user]);

  // Fetch user roles from user_roles table
  const fetchUserRoles = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      const roles = (data?.map(r => r.role) || []) as AppRole[];
      const isAdmin = roles.includes('admin');
      
      // Priority order for primary role: admin > manufacturer > hospital > investor
      const rolePriority: AppRole[] = ['admin', 'manufacturer', 'hospital', 'investor'];
      const primaryRole = rolePriority.find(r => roles.includes(r)) || null;

      setUserRoles({
        roles,
        primaryRole,
        isAdmin,
      });
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setUserRoles({ roles: [], primaryRole: null, isAdmin: false });
          setLoading(false);
        } else if (event === 'SIGNED_IN' && newSession?.user) {
          // Ensure we wait for profile and roles before setting loading to false
          setLoading(true);
          await Promise.all([
            fetchProfile(newSession.user.id),
            fetchUserRoles(newSession.user.id)
          ]);
          updateUserActivity();
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Wait for BOTH profile AND roles to be fetched before setting loading to false
        await Promise.all([
          fetchProfile(currentSession.user.id),
          fetchUserRoles(currentSession.user.id)
        ]);
        updateUserActivity();
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Check if account is scheduled for deletion
      if (data?.is_deleted && data?.can_restore_until) {
        const canRestoreUntil = new Date(data.can_restore_until);
        const now = new Date();
        
        if (now > canRestoreUntil) {
          // Grace period expired, sign out user
          toast({
            title: "Account Deleted",
            description: "Your account has been permanently deleted.",
            variant: "destructive",
          });
          await signOut();
          return;
        }
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const refreshRoles = async () => {
    if (!user) return;
    await fetchUserRoles(user.id);
  };

  // Update user role - adds role to user_roles table
  const updateUserRole = async (role: AppRole) => {
    if (!user) return;
    
    try {
      // Insert the role into user_roles table
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: user.id, role }, { onConflict: 'user_id,role' });
        
      if (error) throw error;
      
      // Also update profile.role for backwards compatibility during migration
      await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);
      
      // Refresh roles and profile to get updated data
      await Promise.all([refreshRoles(), refreshProfile()]);
      
      toast({
        title: "Role updated",
        description: `Your account role has been updated to ${role}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const hasRole = useCallback((role: AppRole): boolean => {
    return userRoles.roles.includes(role);
  }, [userRoles.roles]);

  const setSessionTimeout = (minutes: number) => {
    setSessionTimeoutMinutes(minutes);
    resetActivityTimer();
  };

  const signOut = async () => {
    try {
      // Clear session timeout first
      if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
        setSessionTimeoutId(null);
      }
      
      // Clear local state immediately
      setSession(null);
      setUser(null);
      setProfile(null);
      setUserRoles({ roles: [], primaryRole: null, isAdmin: false });
      
      // Sign out from Supabase with proper scope
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear any cached auth data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      userRoles,
      loading, 
      signOut, 
      refreshProfile,
      refreshRoles,
      updateUserRole,
      hasRole,
      setSessionTimeout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
