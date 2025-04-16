
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAlert, Lock } from "lucide-react";
import CreateAdminUserForm from '@/components/admin/CreateAdminUserForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the validation schema for login
const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('signin');

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleAdminLogin = async (values: LoginFormValues) => {
    setError(null);
    
    try {
      setLoading(true);
      console.log("Attempting to sign in user:", values.email);
      
      // First, sign in the user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
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
        // If there's a profile error but not a "not found" error
        if (profileError.code !== 'PGRST116') {
          console.error("Profile fetch error:", profileError);
          await supabase.auth.signOut();
          throw profileError;
        }
        
        // If profile not found, the user doesn't have proper setup
        console.error("Profile not found for user");
        await supabase.auth.signOut();
        throw new Error('User profile not found. Please contact an administrator.');
      }
      
      console.log("User role:", profileData?.role);
      
      if (profileData?.role !== 'admin') {
        // Sign out if not an admin
        console.log("User is not an admin. Role:", profileData?.role);
        await supabase.auth.signOut();
        throw new Error('You do not have administrator privileges.');
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAdminLogin)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="Admin Email"
                              className="pl-10"
                              {...field}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type="password"
                              placeholder="Password"
                              className="pl-10"
                              {...field}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In as Admin"}
                  </Button>
                </form>
              </Form>
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
