
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Clock, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddProductModal from './AddProductModal';
import AddUserModal from './AddUserModal';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';
import { useToast } from '@/hooks/use-toast';

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [bucketReady, setBucketReady] = useState(false);
  
  useEffect(() => {
    // Check bucket exists when component mounts
    const checkBucket = async () => {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        toast({
          title: "Storage Setup Error",
          description: "Failed to set up image storage. Some features may not work correctly.",
          variant: "destructive",
        });
      }
    };
    
    checkBucket();
  }, []);
  
  const handleAddEquipmentClick = async () => {
    // Create bucket if needed before opening modal
    if (!bucketReady) {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        toast({
          title: "Storage Setup Error",
          description: "Failed to set up image storage. Some features may not work correctly.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsProductModalOpen(true);
  };
  
  const handleProductAdded = () => {
    // Refresh the product list or show a success message
    console.log('Product added successfully');
    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const handleUserAdded = () => {
    // Refresh the user list or show a success message
    console.log('User added successfully');
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Button 
          className="flex items-center bg-[#E02020] hover:bg-[#E02020]/90 text-white"
          onClick={handleAddEquipmentClick}
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
        onProductAdded={handleProductAdded}
      />

      {/* User Modal */}
      <AddUserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default QuickActions;
