
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Clock, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddProductModal from './AddProductModal';
import AddUserModal from './AddUserModal';

const QuickActions = () => {
  const navigate = useNavigate();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Button 
          className="flex items-center bg-[#E02020] hover:bg-[#E02020]/90 text-white"
          onClick={() => setIsProductModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>

        <Button 
          className="flex items-center bg-[#E02020] hover:bg-[#E02020]/90 text-white"
          onClick={() => setIsUserModalOpen(true)}
        >
          <Users className="h-4 w-4 mr-2" />
          Add User Account
        </Button>

        <Button className="flex items-center bg-[#E02020] hover:bg-[#E02020]/90 text-white">
          <Clock className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>

        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => navigate('/dashboard')}
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          View User Dashboard
        </Button>
      </div>

      {/* Product Modal */}
      <AddProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        isAdmin={true}
      />

      {/* User Modal */}
      <AddUserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
      />
    </div>
  );
};

export default QuickActions;
