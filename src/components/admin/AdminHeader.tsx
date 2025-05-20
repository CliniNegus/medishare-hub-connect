
import React, { useState } from 'react';
import { Bell, Calendar, LogOut, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddEquipmentModal from '@/components/equipment/AddEquipmentModal';
import { useToast } from '@/hooks/use-toast';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';
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

  const handleAddEquipmentClick = async () => {
    // Ensure storage bucket exists
    const bucketReady = await createEquipmentImagesBucket();
    if (!bucketReady) {
      toast({
        title: "Storage Setup Error",
        description: "Failed to set up image storage. Some features may not work correctly.",
        variant: "destructive",
      });
    }
    
    setIsAddEquipmentModalOpen(true);
  };

  return (
    <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Button 
          className="bg-[#E02020] hover:bg-[#c01010] text-white"
          onClick={handleAddEquipmentClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
        
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-gray-600">{getInitials()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                {profile?.organization && (
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {profile.organization}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Equipment Modal */}
      <AddEquipmentModal
        open={isAddEquipmentModalOpen}
        onOpenChange={setIsAddEquipmentModalOpen}
        onEquipmentAdded={() => {
          toast({
            title: "Equipment Added",
            description: "The equipment has been successfully added",
          });
        }}
      />
    </header>
  );
};

export default AdminHeader;
