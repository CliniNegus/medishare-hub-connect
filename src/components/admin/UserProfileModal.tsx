
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Building, User, Clock } from 'lucide-react';
import { ActiveUser } from '@/hooks/useActiveUsers';

interface UserProfileModalProps {
  user: ActiveUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  open,
  onOpenChange
}) => {
  if (!user) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-[#E02020] text-white';
      case 'hospital':
        return 'bg-blue-500 text-white';
      case 'manufacturer':
        return 'bg-green-500 text-white';
      case 'investor':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#333333] flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the selected user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Basic Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#333333]">
                {user.full_name || 'No name provided'}
              </h3>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
            <Badge className={getRoleBadgeColor(user.role)}>
              {user.role || 'No role'}
            </Badge>
          </div>

          <Separator />

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-[#333333]">Account Information</h4>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">User ID:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {user.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Organization:</span>
                <span className="text-sm">
                  {user.organization || 'Not specified'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-[#333333]">Activity Information</h4>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Last Active:</span>
                <span className="text-sm">
                  {formatDate(user.last_active)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {user.role || 'No role assigned'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Info Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#333333] mb-2">Quick Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-[#E02020]">
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </div>
                <div className="text-xs text-gray-500">Access Level</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">Active</div>
                <div className="text-xs text-gray-500">Status</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">Verified</div>
                <div className="text-xs text-gray-500">Account</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
