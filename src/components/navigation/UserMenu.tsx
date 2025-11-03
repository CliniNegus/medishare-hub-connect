
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, UserCog, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";

export const UserMenu = ({ onChangeAccountType }: { onChangeAccountType: () => void }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { state: { fromSignOut: true } });
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
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

      <Button
        variant="outline"
        className="w-full justify-start text-destructive hover:text-destructive border-border hover:bg-accent mt-2"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-5 w-5" />
        <span className="ml-3">Delete Account</span>
      </Button>

      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
      />
    </div>
  );
};
