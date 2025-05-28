
import React, { useState } from 'react';
import { Eye, Edit, Search, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveUsers, ActiveUser } from '@/hooks/useActiveUsers';
import UserProfileModal from './UserProfileModal';
import EditUserModal from './EditUserModal';

const ActiveUsersTable = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    updateUser
  } = useActiveUsers();

  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleViewUser = (user: ActiveUser) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleEditUser = (user: ActiveUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const formatLastActive = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-[#E02020] text-white hover:bg-[#E02020]/90';
      case 'hospital':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'manufacturer':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'investor':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getSortIcon = (field: keyof ActiveUser) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, role, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>User ID</span>
                  {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => handleSort('full_name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('full_name')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  {getSortIcon('role')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => handleSort('organization')}
              >
                <div className="flex items-center space-x-1">
                  <span>Organization</span>
                  {getSortIcon('organization')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => handleSort('last_active')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Active</span>
                  {getSortIcon('last_active')}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No users found matching your search.' : 'No active users found.'}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {user.id.substring(0, 8)}...
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono text-xs">{user.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {user.full_name || 'No name'}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role || 'No role'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.organization || 'Not specified'}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatLastActive(user.last_active)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="hover:bg-[#E02020]/5 hover:border-[#E02020]/30"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <UserProfileModal
        user={selectedUser}
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />

      <EditUserModal
        user={selectedUser}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={updateUser}
      />
    </div>
  );
};

export default ActiveUsersTable;
