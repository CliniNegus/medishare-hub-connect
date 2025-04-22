
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileRole: (role: string) => Promise<void>;
  setupTwoFactor: () => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  isTwoFactorEnabled: boolean;
  checkingTwoFactor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [checkingTwoFactor, setCheckingTwoFactor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsTwoFactorEnabled(false);
        } else if (event === 'SIGNED_IN' && newSession?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(() => {
            fetchProfile(newSession.user.id);
            checkTwoFactorStatus(newSession.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
        checkTwoFactorStatus(currentSession.user.id);
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

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const checkTwoFactorStatus = async (userId: string) => {
    setCheckingTwoFactor(true);
    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .select('enabled')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      setIsTwoFactorEnabled(data?.enabled || false);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      setIsTwoFactorEnabled(false);
    } finally {
      setCheckingTwoFactor(false);
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
  
  const setupTwoFactor = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // In a real implementation, this would generate a secret and QR code
      // For demo purposes, we're simulating success
      return true;
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      return false;
    }
  };
  
  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    if (!user || !code) return false;
    
    try {
      // In a real implementation, this would verify the code
      // For demo purposes, we'll simulate success and save to the database
      
      const { error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user.id,
          enabled: true,
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setIsTwoFactorEnabled(true);
      return true;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsTwoFactorEnabled(false);
      
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
      setupTwoFactor,
      verifyTwoFactor,
      isTwoFactorEnabled,
      checkingTwoFactor
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
