
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, UserCog, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const UserMenu = ({ onChangeAccountType }: { onChangeAccountType: () => void }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      
      await signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error deleting account",
        description: error.message || "There was a problem deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-800">
      <Button
        variant="outline"
        className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mb-2"
        onClick={() => navigate('/security-settings')}
      >
        <Shield className="h-5 w-5" />
        <span className="ml-3">Security</span>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mt-2"
        onClick={onChangeAccountType}
      >
        <UserCog className="h-5 w-5" />
        <span className="ml-3">Change Account Type</span>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 mt-2"
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-3">Sign Out</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-red-400 hover:text-red-300 border-gray-700 hover:bg-gray-800 mt-2"
          >
            <Trash2 className="h-5 w-5" />
            <span className="ml-3">Delete Account</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
