
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';
import TwoFactorVerification from '@/components/auth/TwoFactorVerification';
import { Info, Shield } from 'lucide-react';

const SecuritySettings = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30"); // in minutes
  const [showSetupMFA, setShowSetupMFA] = useState(false);
  const [showVerifyMFA, setShowVerifyMFA] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMFAStatus();
    }
  }, [user]);

  const fetchMFAStatus = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_mfa')
        .select('enabled')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setMfaEnabled(data?.enabled || false);
    } catch (error: any) {
      console.error('Error fetching MFA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMFA = async () => {
    if (mfaEnabled) {
      // Disable MFA
      try {
        const { error } = await supabase
          .from('user_mfa')
          .update({ enabled: false })
          .eq('user_id', user?.id);
        
        if (error) throw error;
        
        setMfaEnabled(false);
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Enable MFA
      setShowSetupMFA(true);
    }
  };

  const handleSetupSuccess = () => {
    setShowSetupMFA(false);
    setMfaEnabled(true);
    fetchMFAStatus();
  };

  const updateSessionTimeout = async () => {
    // In a real implementation, this would update the session timeout in the database
    toast({
      title: "Session Timeout Updated",
      description: `Session will now timeout after ${sessionTimeout} minutes of inactivity`,
    });
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="flex items-center mb-8">
          <Shield className="h-8 w-8 text-red-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Security Settings</h1>
            <p className="text-gray-500">Manage your account security and privacy</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </div>
              <Switch
                checked={mfaEnabled}
                onCheckedChange={toggleMFA}
                disabled={loading}
              />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {mfaEnabled 
                  ? "Two-factor authentication is enabled. You'll need to enter a verification code from your authenticator app when signing in."
                  : "Enable two-factor authentication to increase the security of your account."
                }
              </p>
            </CardContent>
          </Card>

          {/* Session Timeout */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Session Timeout</CardTitle>
                <CardDescription>Control how long your session stays active</CardDescription>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Session timeout info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your session will automatically end after this period of inactivity</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Set how long your session remains active before requiring you to sign in again.
              </p>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
                
                <Button onClick={updateSessionTimeout} className="bg-red-600 hover:bg-red-700">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Reset */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password or reset it if forgotten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                It's a good practice to update your password regularly to keep your account secure.
              </p>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MFA Setup Dialog */}
      <Dialog open={showSetupMFA} onOpenChange={setShowSetupMFA}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Protect your account with two-factor authentication
            </DialogDescription>
          </DialogHeader>
          <TwoFactorSetup 
            onSuccess={handleSetupSuccess} 
            onCancel={() => setShowSetupMFA(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* MFA Verification Dialog */}
      <Dialog open={showVerifyMFA} onOpenChange={setShowVerifyMFA}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter the code from your authenticator app
            </DialogDescription>
          </DialogHeader>
          {user && (
            <TwoFactorVerification 
              userId={user.id} 
              onSuccess={() => setShowVerifyMFA(false)} 
              onCancel={() => setShowVerifyMFA(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SecuritySettings;
