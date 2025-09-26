
import React, { useState } from 'react';
import { Calendar, LogOut, Plus, Bell, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddEquipmentModal from '@/components/admin/equipment/AddEquipmentModal';
import AddProductModal from '@/components/admin/AddProductModal';
import { useToast } from '@/hooks/use-toast';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const AdminHeader = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AB';
  };

  const handleAddEquipmentClick = () => {
    setIsAddEquipmentModalOpen(true);
  };

  const handleAddProductClick = () => {
    setIsAddProductModalOpen(true);
  };

  const handleEquipmentAdded = () => {
    toast({
      title: "Equipment Added",
      description: "The equipment has been successfully added to the inventory",
    });
    // Optionally refresh the page or trigger a data refresh
    window.location.reload();
  };

  const handleProductAdded = () => {
    toast({
      title: "Product Added",
      description: "The product has been successfully added to the shop",
    });
    // Optionally refresh the page or trigger a data refresh
    window.location.reload();
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      console.log('Starting sign out process from admin header...');
      
      // Call the signOut method from AuthContext
      await signOut();
      
      // Navigate with state to indicate we came from sign out
      navigate('/auth', { state: { fromSignOut: true } });
      
      console.log('Sign out completed successfully from admin header');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      console.error('Error during sign out from admin header:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-white to-gray-50/50 gap-4">
      {/* Left side - Title with modern styling */}
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#333333] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your platform and monitor system health
        </p>
      </div>
      
      {/* Right side - Actions with enhanced design */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <div className="btn-stack">
          {/* Add Equipment Button */}
          <Button 
            className="bg-gradient-to-r from-[#E02020] to-[#c01010] hover:from-[#c01010] hover:to-[#a00808] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 btn-mobile"
            onClick={handleAddEquipmentClick}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Equipment</span>
            <span className="sm:hidden">Equipment</span>
          </Button>

          {/* Add Product Button */}
          <Button 
            className="bg-gradient-to-r from-[#333333] to-[#1a1a1a] hover:from-[#1a1a1a] hover:to-[#000000] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 btn-mobile"
            onClick={handleAddProductClick}
          >
            <Package className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Product</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Notification Bell with modern styling */}
          <NotificationDropdown />
          
          {/* Calendar Button with subtle styling */}
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-200 hover:border-[#E02020] hover:bg-[#E02020]/5 transition-all duration-200"
          >
            <Calendar className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        
        {/* User Menu with enhanced design */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center transition-all duration-200 hover:shadow-md"
            >
              <span className="font-semibold text-gray-700">{getInitials()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mr-4 mt-2 border-0 shadow-xl bg-white/95 backdrop-blur-md" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-2">
                <p className="text-base font-semibold leading-none text-[#333333]">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-sm leading-none text-gray-500">
                  {user?.email}
                </p>
                {profile?.organization && (
                  <p className="text-xs leading-none text-gray-400 bg-gray-100 px-2 py-1 rounded-md inline-block">
                    {profile.organization}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              disabled={isSigningOut}
              className="text-[#E02020] cursor-pointer hover:bg-red-50 transition-colors duration-200 m-2 rounded-md"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isSigningOut ? "Signing out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Equipment Modal */}
      <AddEquipmentModal
        open={isAddEquipmentModalOpen}
        onOpenChange={setIsAddEquipmentModalOpen}
        onEquipmentAdded={handleEquipmentAdded}
      />

      {/* Product Modal */}
      <AddProductModal
        open={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
        isAdmin={true}
        onProductAdded={handleProductAdded}
      />
    </header>
  );
};

export default AdminHeader;
