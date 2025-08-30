import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, UserCheck, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import Dashboard from '@/components/Dashboard';
import ImpersonationConfirmModal from './ImpersonationConfirmModal';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization: string;
}

const UserDashboardView: React.FC = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: adminUser, signOut } = useAuth();
  const { logAuditEvent } = useAuditLogger();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'impersonate'>(
    searchParams.get('mode') as 'view' | 'impersonate' || 'view'
  );
  const [showImpersonationModal, setShowImpersonationModal] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [originalAdmin, setOriginalAdmin] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    // Check if we're already in impersonation mode
    const impersonationData = sessionStorage.getItem('impersonation_data');
    if (impersonationData) {
      const data = JSON.parse(impersonationData);
      setIsImpersonating(true);
      setOriginalAdmin(data.originalAdmin);
      setMode('impersonate');
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, organization')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data.role === 'admin') {
        toast({
          title: "Access Denied",
          description: "Cannot impersonate admin users for security reasons.",
          variant: "destructive",
        });
        navigate('/admin');
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToImpersonation = () => {
    setShowImpersonationModal(true);
  };

  const handleConfirmImpersonation = async () => {
    if (!userProfile || !adminUser) return;

    try {
      // Log the impersonation start
      await logAuditEvent(
        'IMPERSONATION_START',
        'user_impersonation',
        userProfile.id,
        null,
        {
          admin_id: adminUser.id,
          target_user_id: userProfile.id,
          target_user_email: userProfile.email,
          target_user_role: userProfile.role
        }
      );

      // Store original admin data
      const originalAdminData = {
        id: adminUser.id,
        email: adminUser.email,
        impersonation_start: new Date().toISOString()
      };

      // Store impersonation data in session storage
      sessionStorage.setItem('impersonation_data', JSON.stringify({
        originalAdmin: originalAdminData,
        targetUser: userProfile
      }));

      setOriginalAdmin(originalAdminData);
      setIsImpersonating(true);
      setMode('impersonate');
      setShowImpersonationModal(false);

      // Update URL
      setSearchParams({ mode: 'impersonate' });

      toast({
        title: "Impersonation Active",
        description: `You are now impersonating ${userProfile.full_name}`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error starting impersonation:', error);
      toast({
        title: "Error",
        description: "Failed to start impersonation",
        variant: "destructive",
      });
    }
  };

  const handleExitImpersonation = async () => {
    if (!userProfile || !originalAdmin) return;

    try {
      // Log the impersonation end
      await logAuditEvent(
        'IMPERSONATION_END',
        'user_impersonation',
        userProfile.id,
        null,
        {
          admin_id: originalAdmin.id,
          target_user_id: userProfile.id,
          duration_minutes: Math.floor(
            (new Date().getTime() - new Date(originalAdmin.impersonation_start).getTime()) / (1000 * 60)
          )
        }
      );

      // Clear impersonation data
      sessionStorage.removeItem('impersonation_data');
      
      // Navigate back to admin panel
      navigate('/admin');

      toast({
        title: "Impersonation Ended",
        description: "Returned to admin dashboard",
      });

    } catch (error) {
      console.error('Error ending impersonation:', error);
      // Still exit impersonation even if logging fails
      sessionStorage.removeItem('impersonation_data');
      navigate('/admin');
    }
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020]"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Banner */}
      <div className={`${mode === 'view' ? 'bg-blue-600' : 'bg-orange-600'} text-white p-4 shadow-lg`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mode === 'view' ? (
              <Eye className="h-5 w-5" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <div>
              <h2 className="font-semibold">
                {mode === 'view' 
                  ? `Admin viewing dashboard in read-only mode`
                  : `You are impersonating ${userProfile.full_name}`
                }
              </h2>
              <p className="text-sm opacity-90">
                {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)} - {userProfile.email}
                {userProfile.organization && ` (${userProfile.organization})`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'view' && !isImpersonating && (
              <Button
                onClick={handleSwitchToImpersonation}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Switch to Impersonation
              </Button>
            )}
            
            {isImpersonating ? (
              <Button
                onClick={handleExitImpersonation}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Exit Impersonation
              </Button>
            ) : (
              <Button
                onClick={handleBackToAdmin}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Warning for View Mode */}
      {mode === 'view' && (
        <Alert className="m-4 border-blue-200 bg-blue-50">
          <Eye className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are viewing this dashboard in read-only mode. All interactive actions are disabled.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Content */}
      <div className={mode === 'view' ? 'pointer-events-none select-none opacity-75' : ''}>
        <Dashboard />
      </div>

      {/* Impersonation Confirmation Modal */}
      <ImpersonationConfirmModal
        open={showImpersonationModal}
        onOpenChange={setShowImpersonationModal}
        user={userProfile}
        onConfirm={handleConfirmImpersonation}
      />
    </div>
  );
};

export default UserDashboardView;