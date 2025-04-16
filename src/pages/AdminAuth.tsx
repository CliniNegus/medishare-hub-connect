
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAlert } from "lucide-react";
import CreateAdminUserForm from '@/components/admin/CreateAdminUserForm';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('signin');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      // First, sign in the user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }
      
      if (!data.user) {
        throw new Error('No user returned from authentication');
      }
      
      console.log("User signed in:", data.user.id);
      
      // Check if user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      console.log("Profile data:", profileData, "Profile error:", profileError);
      
      if (profileError) {
        // Sign out if there was an error checking the role
        await supabase.auth.signOut();
        throw profileError;
      }
      
      console.log("User role:", profileData?.role);
      
      if (profileData?.role !== 'admin') {
        // Sign out if not an admin
        await supabase.auth.signOut();
        throw new Error('You do not have administrator privileges');
      }
      
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error: any) {
      console.error("Admin login error:", error);
      setError(error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-red-600">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Sign in or create an administrator account
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-100 border-red-600 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="signup">
            <CardContent>
              <CreateAdminUserForm />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminAuth;
