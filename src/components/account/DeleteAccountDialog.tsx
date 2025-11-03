import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAccountDialog = ({ open, onOpenChange }: DeleteAccountDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Call soft delete function
      const { error } = await supabase.rpc('soft_delete_account', {
        target_user_id: user.id,
        grace_period_days: 7
      });

      if (error) throw error;

      toast({
        title: "Account Scheduled for Deletion",
        description: "Your account has been scheduled for deletion. You can restore it within 7 days by signing in again.",
      });

      // Sign out the user
      setTimeout(async () => {
        await signOut();
      }, 2000);

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Account</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete your account? This will:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Mark your account for deletion</li>
            <li>Sign you out immediately</li>
            <li>Allow restoration within 7 days</li>
            <li>Permanently delete after 7 days</li>
          </ul>
          <p className="text-sm font-medium text-foreground pt-2">
            You can restore your account by signing in again within 7 days.
          </p>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
