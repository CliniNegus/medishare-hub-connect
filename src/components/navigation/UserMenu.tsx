
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, UserCog, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    <div className="p-4 border-t border-border bg-card">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium text-foreground">Theme</Label>
          <ThemeToggle />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <Button
        variant="outline"
        className="w-full justify-start text-foreground hover:text-foreground border-border hover:bg-accent mb-2"
        onClick={() => navigate('/security-settings')}
      >
        <Shield className="h-5 w-5" />
        <span className="ml-3">Security</span>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-foreground hover:text-foreground border-border hover:bg-accent mt-2"
        onClick={onChangeAccountType}
      >
        <UserCog className="h-5 w-5" />
        <span className="ml-3">Change Account Type</span>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-foreground hover:text-foreground border-border hover:bg-accent mt-2"
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-3">Sign Out</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive border-border hover:bg-accent mt-2"
          >
            <Trash2 className="h-5 w-5" />
            <span className="ml-3">Delete Account</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-background text-foreground hover:bg-accent">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
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
