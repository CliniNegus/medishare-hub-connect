
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from '../ThemeToggle';
import { Store, Plus, Sparkles, Users, LogOut, UserCog } from "lucide-react";
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
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { AccountSettingsModal } from '@/components/account/AccountSettingsModal';

const ManufacturerHeader = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

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
    setAccountSettingsOpen(true);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left Section - Logo, Brand and Welcome */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex h-14 w-14 rounded-xl bg-white/15 backdrop-blur-sm items-center justify-center border border-white/20">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Manufacturer Hub</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
              {profile && (
                <p className="text-white/90 text-sm sm:text-base">
                  Welcome back, <span className="font-medium">{profile.full_name || user?.email?.split('@')[0]}</span>
                </p>
              )}
              {profile?.organization && (
                <p className="text-white/70 text-xs sm:text-sm flex items-center mt-0.5">
                  <Users className="h-3 w-3 mr-1.5" />
                  {profile.organization}
                </p>
              )}
            </div>
          </div>
          
          {/* Right Section - Actions and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
            {/* Virtual Shops Button - Always visible */}
            <Button 
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#E02020] transition-all duration-200 hover:scale-105 px-3 py-2"
              onClick={handleManageShops}
            >
              <Store className="h-4 w-4" />
              <span className="ml-2 hidden xs:inline">Virtual Shops</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggleButton />

            {/* Notifications */}
            <div className="text-white [&>button]:text-white [&>button:hover]:bg-white/10 [&_svg]:text-white [&_.bg-\\[\\#E02020\\]]:bg-white [&_.bg-\\[\\#E02020\\]]:text-[#E02020]">
              <NotificationDropdown />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-all duration-200 p-0">
                  <Avatar className="h-9 w-9 border-2 border-white/30 shadow-lg">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-white text-[#E02020] font-semibold text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-popover shadow-xl border border-border z-50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {profile?.full_name || 'Manufacturer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Manufacturer Account
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Quick Actions in dropdown */}
                <DropdownMenuItem onClick={handleManageShops}>
                  <Store className="mr-2 h-4 w-4" />
                  <span>Virtual Shops</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddProduct}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Product</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

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
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
      
      <AccountSettingsModal
        open={accountSettingsOpen}
        onOpenChange={setAccountSettingsOpen}
      />
    </>
  );
};

export default ManufacturerHeader;
