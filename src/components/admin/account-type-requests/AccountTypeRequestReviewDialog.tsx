import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';

interface AccountTypeRequestReviewDialogProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => Promise<void>;
  onReject: (feedback: string) => Promise<void>;
  isProcessing: boolean;
}

const AccountTypeRequestReviewDialog: React.FC<AccountTypeRequestReviewDialogProps> = ({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  if (!request) return null;

  const isPending = request.status === 'pending';

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      hospital: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      manufacturer: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
      investor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
    };
    return (
      <Badge variant="outline" className={`${colors[role] || ''} text-sm px-3 py-1`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(rejectionReason);
    setRejectionReason('');
    setShowRejectionForm(false);
  };

  const handleClose = () => {
    setShowRejectionForm(false);
    setRejectionReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPending ? 'Review Account Type Change Request' : 'Request Details'}
          </DialogTitle>
          <DialogDescription>
            {isPending 
              ? 'Review and approve or reject this account type change request.'
              : 'View the details of this account type change request.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{request.user_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{request.user_email}</span>
            </div>
          </div>

          <Separator />

          {/* Role Change */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Account Type Change</Label>
            <div className="flex items-center gap-3 justify-center py-4 bg-muted/50 rounded-lg">
              {getRoleBadge(request.from_role)}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              {getRoleBadge(request.to_role)}
            </div>
          </div>

          {/* Status & Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Requested</Label>
              <p className="text-sm mt-1">
                {format(new Date(request.created_at), 'MMM d, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Admin Feedback (for rejected/approved) */}
          {request.admin_feedback && (
            <>
              <Separator />
              <div>
                <Label className="text-sm text-muted-foreground">Admin Feedback</Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{request.admin_feedback}</p>
              </div>
            </>
          )}

          {/* Reviewed Info */}
          {request.reviewed_at && (
            <div>
              <Label className="text-sm text-muted-foreground">Reviewed</Label>
              <p className="text-sm mt-1">
                {format(new Date(request.reviewed_at), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          )}

          {/* Rejection Form */}
          {isPending && showRejectionForm && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="rejection-reason" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Rejection Reason (Required)
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejecting this request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isPending ? (
            showRejectionForm ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectionForm(false)}
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                >
                  {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                  onClick={() => setShowRejectionForm(true)}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={onApprove}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Approving...' : 'Approve'}
                </Button>
              </>
            )
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountTypeRequestReviewDialog;
