
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileRole: (role: string) => Promise<void>;
  setSessionTimeout: (minutes: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
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

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (event === 'SIGNED_IN' && newSession?.user) {
          fetchProfile(newSession.user.id);
          // Update activity on sign in
          updateUserActivity();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
        // Update activity for existing session
        updateUserActivity();
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const updateProfileRole = async (role: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refresh profile to get updated data
      await refreshProfile();
      
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
      loading, 
      signOut, 
      refreshProfile,
      updateProfileRole,
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
