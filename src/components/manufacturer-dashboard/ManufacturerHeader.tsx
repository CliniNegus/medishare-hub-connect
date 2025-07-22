
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Store, Plus, Sparkles, Users, LogOut, UserCog, Bell, Search, Menu } from "lucide-react";
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
          {/* Left Section - Logo, Brand and Welcome */}
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
          
          {/* Right Section - Actions and User Menu - Optimized */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions - Responsive */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#E02020] transition-all duration-200 hover:scale-105 px-2.5 py-2"
                onClick={handleManageShops}
              >
                <Store className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Virtual Shops</span>
              </Button>
              <Button 
                size="sm"
                className="bg-white text-[#E02020] hover:bg-white/90 font-medium transition-all duration-200 hover:scale-105 px-2.5 py-2"
                onClick={handleAddProduct}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Add Product</span>
              </Button>
            </div>

            {/* Actions Dropdown for Mobile */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white shadow-xl border z-50">
                  <DropdownMenuItem onClick={handleManageShops}>
                    <Store className="mr-2 h-4 w-4" />
                    <span>Virtual Shops</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddProduct}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Product</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications - Compact */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2 transition-all duration-200 hover:scale-105"
            >
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Menu - Compact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-all duration-200">
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-white text-[#E02020] font-semibold text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-xl border z-50" align="end" forceMount>
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
                
                {/* Mobile Actions - Only show on mobile */}
                <div className="sm:hidden">
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
