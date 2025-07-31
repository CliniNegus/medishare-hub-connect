import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ActiveUser } from '@/hooks/useActiveUsers';

interface UserViewDialogProps {
  user: ActiveUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserViewDialog = ({ user, open, onOpenChange }: UserViewDialogProps) => {
  if (!user) return null;

  const getStatusBadge = (user: ActiveUser) => {
    const lastActive = user.last_active ? new Date(user.last_active) : null;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const isActive = lastActive && lastActive > thirtyDaysAgo;
    
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const formatLastActive = (date: string | null) => {
    if (!date) return 'Never';
    const lastActive = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return lastActive.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-sm font-medium">{user.full_name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="text-sm capitalize">{user.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Organization</label>
            <p className="text-sm">{user.organization || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">{getStatusBadge(user)}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Last Active</label>
            <p className="text-sm">{formatLastActive(user.last_active)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};