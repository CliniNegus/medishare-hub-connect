import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, User } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization: string;
}

interface ImpersonationConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  onConfirm: () => void;
}

const ImpersonationConfirmModal: React.FC<ImpersonationConfirmModalProps> = ({
  open,
  onOpenChange,
  user,
  onConfirm
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <Shield className="h-5 w-5" />
            Impersonation Warning
          </DialogTitle>
          <DialogDescription>
            You are about to impersonate another user. This action will be logged for security purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Security Notice:</strong> All actions performed during impersonation will be executed as this user and logged in the audit trail.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              User Details
            </h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {user.full_name || 'Unnamed User'}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
              {user.organization && (
                <p><span className="font-medium">Organization:</span> {user.organization}</p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>What happens during impersonation:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You will be logged in as this user</li>
              <li>All actions will appear as if performed by them</li>
              <li>Data access will be limited to their permissions</li>
              <li>A warning banner will be displayed</li>
              <li>All activities will be logged for audit purposes</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Confirm Impersonation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImpersonationConfirmModal;