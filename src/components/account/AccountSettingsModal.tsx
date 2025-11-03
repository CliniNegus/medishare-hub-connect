import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserCog, Trash2, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import ChangeAccountTypeModal from '../ChangeAccountTypeModal';

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountSettingsModal = ({ open, onOpenChange }: AccountSettingsModalProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showChangeAccountType, setShowChangeAccountType] = useState(false);
  const navigate = useNavigate();

  const handleChangeAccountType = () => {
    onOpenChange(false);
    setShowChangeAccountType(true);
  };

  const handleDeleteAccount = () => {
    onOpenChange(false);
    setShowDeleteDialog(true);
  };

  const handleSecuritySettings = () => {
    onOpenChange(false);
    navigate('/security-settings');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 py-4">
            {/* Security Settings */}
            <Button
              variant="outline"
              className="w-full justify-start text-foreground hover:text-foreground border-border hover:bg-accent"
              onClick={handleSecuritySettings}
            >
              <Shield className="h-5 w-5 mr-3" />
              <span>Security Settings</span>
            </Button>

            {/* Change Account Type */}
            <Button
              variant="outline"
              className="w-full justify-start text-foreground hover:text-foreground border-border hover:bg-accent"
              onClick={handleChangeAccountType}
            >
              <UserCog className="h-5 w-5 mr-3" />
              <span>Change Account Type</span>
            </Button>

            <Separator className="my-4" />

            {/* Delete Account */}
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive border-border hover:bg-destructive/10"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-5 w-5 mr-3" />
              <span>Delete Account</span>
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Deleting your account will mark it for deletion with a 7-day grace period
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
      />

      <ChangeAccountTypeModal 
        open={showChangeAccountType}
        onOpenChange={setShowChangeAccountType}
      />
    </>
  );
};
