import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from 'lucide-react';
import { ActiveUser } from '@/hooks/useActiveUsers';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserDeleteDialogProps {
  user: ActiveUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

export const UserDeleteDialog = ({ user, open, onOpenChange, onUserDeleted }: UserDeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteType, setDeleteType] = useState<'soft' | 'permanent'>('soft');
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (deleteType === 'soft') {
        // Soft delete
        const { error } = await supabase.rpc('soft_delete_account', {
          target_user_id: user.id,
          grace_period_days: 7
        });

        if (error) throw error;

        // Log admin action
        await supabase.rpc('log_admin_action', {
          action_type_param: 'SOFT_DELETE_USER',
          target_user_id_param: user.id,
          details_param: { grace_period_days: 7 }
        });

        toast({
          title: "User Account Soft Deleted",
          description: `${user.full_name || user.email}'s account has been scheduled for deletion. Can be restored within 7 days.`,
        });
      } else {
        // Permanent delete
        const { error } = await supabase.rpc('permanent_delete_account', {
          target_user_id: user.id
        });

        if (error) throw error;

        // Log admin action
        await supabase.rpc('log_admin_action', {
          action_type_param: 'PERMANENT_DELETE_USER',
          target_user_id_param: user.id,
          details_param: { deletion_type: 'permanent' }
        });

        toast({
          title: "User Account Permanently Deleted",
          description: `${user.full_name || user.email}'s account has been permanently removed.`,
        });
      }
      
      onUserDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error deleting user",
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
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete User Account</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Choose how to delete this user's account. Soft delete allows restoration within 7 days.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2 p-3 bg-muted/50 rounded-md">
            <p className="text-sm"><strong>Name:</strong> {user.full_name || 'N/A'}</p>
            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
            <p className="text-sm"><strong>Role:</strong> {user.role}</p>
          </div>

          <RadioGroup value={deleteType} onValueChange={(value: 'soft' | 'permanent') => setDeleteType(value)}>
            <div className="flex items-start space-x-2 p-3 rounded-md border hover:bg-accent cursor-pointer">
              <RadioGroupItem value="soft" id="soft" className="mt-1" />
              <Label htmlFor="soft" className="cursor-pointer flex-1">
                <div className="font-medium">Soft Delete (Recommended)</div>
                <div className="text-sm text-muted-foreground">
                  Mark account as deleted. User can restore within 7 days by signing in.
                </div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 p-3 rounded-md border hover:bg-accent cursor-pointer">
              <RadioGroupItem value="permanent" id="permanent" className="mt-1" />
              <Label htmlFor="permanent" className="cursor-pointer flex-1">
                <div className="font-medium text-destructive">Permanent Delete</div>
                <div className="text-sm text-muted-foreground">
                  Immediately and permanently remove account and all data. Cannot be undone.
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : deleteType === 'soft' ? "Soft Delete" : "Permanently Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};