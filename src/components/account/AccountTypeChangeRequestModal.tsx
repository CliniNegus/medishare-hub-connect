import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hospital, Factory, PiggyBank, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useUserRole, UserRole } from '@/contexts/UserRoleContext';
import { useAccountTypeChangeRequest } from '@/hooks/useAccountTypeChangeRequest';
import { formatDistanceToNow } from 'date-fns';

interface AccountTypeChangeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleIcons: Record<string, React.ReactNode> = {
  hospital: <Hospital className="h-5 w-5 mr-2 text-primary" />,
  manufacturer: <Factory className="h-5 w-5 mr-2 text-primary" />,
  investor: <PiggyBank className="h-5 w-5 mr-2 text-primary" />,
};

const roleLabels: Record<string, { title: string; description: string }> = {
  hospital: { title: 'Hospital', description: 'For healthcare providers' },
  manufacturer: { title: 'Manufacturer', description: 'For equipment suppliers' },
  investor: { title: 'Investor', description: 'For financial backers' },
};

const AccountTypeChangeRequestModal: React.FC<AccountTypeChangeRequestModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { role } = useUserRole();
  const { 
    pendingRequest, 
    recentRequests, 
    hasPendingRequest, 
    submitRequest, 
    loading 
  } = useAccountTypeChangeRequest();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === role) {
      toast({
        title: "No change selected",
        description: "Please select a different account type.",
        variant: "destructive",
      });
      return;
    }

    if (hasPendingRequest) {
      toast({
        title: "Request already pending",
        description: "You already have a pending account type change request.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await submitRequest(selectedRole);
      
      if (success) {
        toast({
          title: "Request Submitted",
          description: "Your request has been submitted and is pending admin approval.",
          duration: 5000,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Failed to submit request",
          description: "An error occurred while submitting your request.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to submit request",
        description: error.message || "An error occurred while submitting your request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800';
      case 'approved':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      default:
        return 'bg-muted border-border';
    }
  };

  const recentRejectedOrApproved = recentRequests
    .filter(r => r.status !== 'pending')
    .slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting || !newOpen) onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Account Type Change</DialogTitle>
          <DialogDescription>
            Select the account type you want to change to. Your request will be reviewed by an admin.
          </DialogDescription>
        </DialogHeader>

        {/* Pending Request Alert */}
        {pendingRequest && (
          <Alert className={`${getStatusColor('pending')} border`}>
            <Clock className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700 dark:text-amber-300">Pending Request</AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400">
              You have a pending request to change from <strong>{pendingRequest.from_role}</strong> to{' '}
              <strong>{pendingRequest.to_role}</strong>.
              <br />
              <span className="text-xs">
                Submitted {formatDistanceToNow(new Date(pendingRequest.created_at), { addSuffix: true })}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Request History */}
        {recentRejectedOrApproved.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Recent Requests</Label>
            <div className="space-y-2">
              {recentRejectedOrApproved.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-3 rounded-lg border ${getStatusColor(request.status)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(request.status)}
                    <span className="font-medium capitalize text-sm">{request.status}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(request.reviewed_at || request.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">
                    {request.from_role} → {request.to_role}
                  </p>
                  {request.admin_feedback && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Feedback: {request.admin_feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Selection */}
        {!hasPendingRequest && (
          <div className="py-4">
            <Label className="text-sm font-medium mb-3 block">Select New Account Type</Label>
            <RadioGroup 
              value={selectedRole} 
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="grid gap-3"
              disabled={loading || isSubmitting}
            >
              {(['hospital', 'manufacturer', 'investor'] as UserRole[]).map((roleOption) => (
                <div 
                  key={roleOption}
                  className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                    selectedRole === roleOption 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  } ${roleOption === role ? 'opacity-50' : ''}`}
                >
                  <RadioGroupItem 
                    value={roleOption} 
                    id={roleOption} 
                    disabled={roleOption === role}
                  />
                  <Label htmlFor={roleOption} className="flex items-center cursor-pointer flex-1">
                    {roleIcons[roleOption]}
                    <div>
                      <p className="font-medium">{roleLabels[roleOption].title}</p>
                      <p className="text-sm text-muted-foreground">
                        {roleLabels[roleOption].description}
                      </p>
                    </div>
                    {roleOption === role && (
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {hasPendingRequest ? 'Close' : 'Cancel'}
          </Button>
          {!hasPendingRequest && (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || selectedRole === role || loading}
            >
              {isSubmitting ? "Submitting..." : "Request Account Type Change"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountTypeChangeRequestModal;
