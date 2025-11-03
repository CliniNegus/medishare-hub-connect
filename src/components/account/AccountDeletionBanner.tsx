import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AccountDeletionBannerProps {
  canRestoreUntil: string;
}

export const AccountDeletionBanner = ({ canRestoreUntil }: AccountDeletionBannerProps) => {
  const [isRestoring, setIsRestoring] = React.useState(false);
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();

  const daysLeft = Math.ceil((new Date(canRestoreUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleRestore = async () => {
    if (!user) return;

    setIsRestoring(true);
    try {
      const { data, error } = await supabase.rpc('restore_deleted_account', {
        target_user_id: user.id
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Account Restored",
          description: "Your account has been successfully restored.",
        });
        
        // Refresh the profile to update the UI
        await refreshProfile();
      } else {
        toast({
          title: "Restoration Failed",
          description: "Your account cannot be restored. The grace period may have expired.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error restoring account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to restore account.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">Account Scheduled for Deletion</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your account is scheduled to be permanently deleted in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. 
            You can restore it before {new Date(canRestoreUntil).toLocaleDateString()}.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestore}
            disabled={isRestoring}
            className="mt-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {isRestoring ? "Restoring..." : "Restore My Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};
