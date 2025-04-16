
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, LogOut, Trash } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ButtonLoader } from '@/components/ui/loader';

const AdminResetTool = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleSignOutAllSessions = async () => {
    try {
      setIsSigningOut(true);
      
      // Sign out the current user
      await signOut();
      
      toast({
        title: "Sign out successful",
        description: "You have been signed out. Redirecting to login page.",
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/auth');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Card className="shadow-md border-border bg-white">
      <CardHeader className="bg-red-50 border-b border-red-200">
        <CardTitle className="text-xl flex items-center text-red-700">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Admin Reset Tools
        </CardTitle>
        <CardDescription className="text-red-600">
          Use these tools with caution. These actions cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            These actions are irreversible and meant for development or emergency use only.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-md bg-red-50">
            <h3 className="font-medium flex items-center text-red-800 mb-2">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All Sessions
            </h3>
            <p className="text-sm text-red-700 mb-4">
              This will sign out your current session and redirect you to the login page.
            </p>
            <Button 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleSignOutAllSessions}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <ButtonLoader /> Signing Out...
                </>
              ) : (
                "Sign Out & Reset Session"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-red-50 border-t border-red-200 text-xs text-red-600">
        For development and testing purposes only.
      </CardFooter>
    </Card>
  );
};

export default AdminResetTool;
