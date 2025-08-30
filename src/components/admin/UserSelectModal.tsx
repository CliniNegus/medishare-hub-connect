import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Eye, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization: string;
  last_active: string;
}

interface UserSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelected: (user: UserProfile, mode: 'view' | 'impersonate') => void;
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({
  open,
  onOpenChange,
  onUserSelected
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, organization, last_active')
        .neq('role', 'admin') // Prevent impersonation of admins
        .order('last_active', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDashboard = () => {
    if (selectedUser) {
      onUserSelected(selectedUser, 'view');
      onOpenChange(false);
      setSelectedUser(null);
    }
  };

  const handleImpersonate = () => {
    if (selectedUser) {
      onUserSelected(selectedUser, 'impersonate');
      onOpenChange(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'hospital': return 'bg-blue-100 text-blue-800';
      case 'manufacturer': return 'bg-green-100 text-green-800';
      case 'investor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select User to View Dashboard
          </DialogTitle>
          <DialogDescription>
            Choose a user to view their dashboard in view-only mode or impersonate them.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, organization, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto max-h-96 border rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020]"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {user.full_name || 'Unnamed User'}
                        </h3>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      {user.organization && (
                        <p className="text-sm text-gray-500 mb-1">{user.organization}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Last active: {formatLastActive(user.last_active)}
                      </p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className="text-blue-500">
                        <UserCheck className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleViewDashboard}
            disabled={!selectedUser}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Dashboard (Read-Only)
          </Button>
          <Button
            onClick={handleImpersonate}
            disabled={!selectedUser}
            className="flex items-center gap-2 bg-[#E02020] hover:bg-[#c01010]"
          >
            <UserCheck className="h-4 w-4" />
            Impersonate User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserSelectModal;