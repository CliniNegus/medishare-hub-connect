
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Store, Plus, Sparkles, Users, LogOut, UserCog, Bell, Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddProductModal from '@/components/admin/AddProductModal';
import ChangeAccountTypeModal from '@/components/ChangeAccountTypeModal';

const ManufacturerHeader = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [changeAccountTypeOpen, setChangeAccountTypeOpen] = useState(false);

  const handleAddProduct = () => {
    setAddProductModalOpen(true);
  };

  const handleManageShops = () => {
    navigate("/virtual-shops");
  };

  const handleProductAdded = () => {
    console.log('Product added successfully');
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out manufacturer...');
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleChangeAccountType = () => {
    setChangeAccountTypeOpen(true);
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'M';
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Left Section - Brand and Welcome */}
          <div className="flex items-center space-x-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Manufacturer Hub</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
              {profile && (
                <p className="text-white/90">
                  Welcome back, {profile.full_name || user?.email?.split('@')[0]}
                </p>
              )}
              {profile?.organization && (
                <p className="text-white/75 text-sm flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  {profile.organization}
                </p>
              )}
            </div>
          </div>
          
          {/* Right Section - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#E02020] transition-all duration-200"
                onClick={handleManageShops}
              >
                <Store className="h-4 w-4 mr-2" />
                Virtual Shops
              </Button>
              <Button 
                size="sm"
                className="bg-white text-[#E02020] hover:bg-white/90 font-medium"
                onClick={handleAddProduct}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-white text-[#E02020] font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {profile?.full_name || 'Manufacturer'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      Manufacturer Account
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Mobile Actions */}
                <div className="md:hidden">
                  <DropdownMenuItem onClick={handleManageShops}>
                    <Store className="mr-2 h-4 w-4" />
                    <span>Virtual Shops</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddProduct}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Product</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangeAccountType}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <AddProductModal
        open={addProductModalOpen}
        onOpenChange={setAddProductModalOpen}
        isAdmin={false}
        onProductAdded={handleProductAdded}
      />
      
      <ChangeAccountTypeModal
        open={changeAccountTypeOpen}
        onOpenChange={setChangeAccountTypeOpen}
      />
    </>
  );
};

export default ManufacturerHeader;
