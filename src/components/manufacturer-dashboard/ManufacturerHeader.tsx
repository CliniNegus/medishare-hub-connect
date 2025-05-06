
import React from 'react';
import { Button } from "@/components/ui/button";
import { Store, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const ManufacturerHeader = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Manufacturer Dashboard</h1>
        {profile && (
          <p className="text-gray-600">
            {profile.full_name || user?.email} {profile.organization && `• ${profile.organization}`}
          </p>
        )}
      </div>
      <div className="flex space-x-3">
        <Button 
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-50"
          onClick={() => navigate("/virtual-shops")}
        >
          <Store className="mr-2 h-4 w-4" />
          Manage Virtual Shops
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => navigate("/add-equipment")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default ManufacturerHeader;
