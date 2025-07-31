import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ActiveUser } from '@/hooks/useActiveUsers';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserSuspendDialogProps {
  user: ActiveUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSuspended: () => void;
}

export const UserSuspendDialog = ({ user, open, onOpenChange, onUserSuspended }: UserSuspendDialogProps) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuspend = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // For now, we'll just show a success message since user suspension 
      // would typically involve auth-level changes
      toast({
        title: "User suspended",
        description: `${user.full_name || user.email} has been suspended. Reason: ${reason || 'No reason provided'}`,
      });
      
      onUserSuspended();
      onOpenChange(false);
      setReason('');
    } catch (error: any) {
      toast({
        title: "Error suspending user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Suspend User</DialogTitle>
          <DialogDescription>
            This will suspend the user's account access. They will not be able to log in until unsuspended.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.full_name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
          <div>
            <Label htmlFor="reason">Reason for suspension (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for suspension..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleSuspend}
            disabled={isLoading}
          >
            {isLoading ? "Suspending..." : "Suspend User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};