import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useAccountTypeChangeRequest } from '@/hooks/useAccountTypeChangeRequest';
import { formatDistanceToNow } from 'date-fns';

const PendingAccountTypeRequestBanner: React.FC = () => {
  const { pendingRequest, loading } = useAccountTypeChangeRequest();

  if (loading || !pendingRequest) {
    return null;
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      hospital: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      manufacturer: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
      investor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
    };
    return (
      <Badge variant="outline" className={colors[role] || ''}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 mb-6">
      <Clock className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-700 dark:text-amber-300">
        Account Type Change Request Pending
      </AlertTitle>
      <AlertDescription className="text-amber-600 dark:text-amber-400">
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span>You requested to change from</span>
          {getRoleBadge(pendingRequest.from_role)}
          <ArrowRight className="h-4 w-4" />
          {getRoleBadge(pendingRequest.to_role)}
        </div>
        <p className="text-xs mt-2">
          Submitted {formatDistanceToNow(new Date(pendingRequest.created_at), { addSuffix: true })}. 
          An admin will review your request shortly.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default PendingAccountTypeRequestBanner;
