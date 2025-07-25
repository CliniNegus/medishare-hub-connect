
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddUserModal from './AddUserModal';
import ActiveUsersTable from './ActiveUsersTable';

interface Stats {
  hospitals: number;
  manufacturers: number;
  investors: number;
}

const UserManagement = ({ stats }: { stats: Stats }) => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserAdded = () => {
    // Increment trigger to refresh the user list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">User Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Accounts</CardTitle>
            <CardDescription>{stats.hospitals} active accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Hospital Accounts</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manufacturer Accounts</CardTitle>
            <CardDescription>{stats.manufacturers} active accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Manufacturer Accounts</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Investor Accounts</CardTitle>
            <CardDescription>{stats.investors} active accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Investor Accounts</Button>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Recently Active Users</h3>
      <ActiveUsersTable />

      {/* Add User Modal */}
      <AddUserModal
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UserManagement;
