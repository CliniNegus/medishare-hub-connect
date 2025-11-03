import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  const [deleteType, setDeleteType] = useState<'soft' | 'permanent'>('soft');
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      if (deleteType === 'soft') {
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
      } else {
        // Call permanent delete function
        const { error } = await supabase.rpc('permanent_delete_account', {
          target_user_id: user.id
        });

        if (error) throw error;

        toast({
          title: "Account Permanently Deleted",
          description: "Your account and all associated data have been permanently deleted.",
        });
      }

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
            Choose how you want to delete your account:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup value={deleteType} onValueChange={(value) => setDeleteType(value as 'soft' | 'permanent')}>
            <div className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <RadioGroupItem value="soft" id="soft" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="soft" className="font-medium cursor-pointer">
                  Soft Delete (7-day grace period)
                </Label>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground mt-2">
                  <li>Mark account for deletion</li>
                  <li>Can restore within 7 days</li>
                  <li>Permanently deleted after grace period</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-destructive rounded-lg">
              <RadioGroupItem value="permanent" id="permanent" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="permanent" className="font-medium cursor-pointer text-destructive">
                  Permanent Delete (Immediate)
                </Label>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground mt-2">
                  <li>Immediate and irreversible deletion</li>
                  <li>All data permanently removed</li>
                  <li>Cannot be restored</li>
                </ul>
              </div>
            </div>
          </RadioGroup>
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
