
import React from 'react';
import { Button } from "@/components/ui/button";
import { Store, Plus, Sparkles, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const ManufacturerHeader = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/add-equipment");
  };

  const handleManageShops = () => {
    navigate("/virtual-shops");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl lg:text-4xl font-bold">Manufacturer Dashboard</h1>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </div>
          <div className="space-y-1">
            {profile && (
              <p className="text-white/90 text-lg">
                Welcome back, {profile.full_name || user?.email?.split('@')[0]}
              </p>
            )}
            {profile?.organization && (
              <p className="text-white/75 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {profile.organization}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button 
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#E02020] transition-all duration-200 backdrop-blur-sm"
            onClick={handleManageShops}
          >
            <Store className="mr-2 h-4 w-4" />
            Manage Virtual Shops
          </Button>
          <Button 
            className="bg-white text-[#E02020] hover:bg-white/90 font-semibold shadow-lg"
            onClick={handleAddProduct}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerHeader;
