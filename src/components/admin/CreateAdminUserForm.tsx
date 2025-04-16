
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the parameter types for the create_admin_user RPC call
interface CreateAdminParams {
  admin_email: string;
  admin_password: string;
  full_name?: string | null;
}

const CreateAdminUserForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      
      // Define params with correct type
      const params: CreateAdminParams = {
        admin_email: email,
        admin_password: password,
        full_name: fullName || null
      };
      
      console.log("Creating admin user with params:", {
        email: params.admin_email,
        fullName: params.full_name
      });
      
      // Call the RPC function to create an admin user
      const { data, error } = await supabase.rpc(
        'create_admin_user', 
        params
      );

      if (error) {
        console.error("Error creating admin user:", error);
        throw error;
      }
      
      console.log("Admin user created successfully:", data);
      setSuccess(`Admin user created with ID: ${data}`);
      
      toast({
        title: "Admin user created",
        description: `Successfully created admin user with ID: ${data}`,
      });
      
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
      console.error("Failed to create admin user:", error);
      setError(error.message);
      toast({
        title: "Failed to create admin user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create Admin User</CardTitle>
        <CardDescription>
          Create a new user with admin privileges
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-100 border-red-600 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-100 border-green-600 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="admin-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              id="admin-full-name"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              id="admin-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? "Creating..." : "Create Admin User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUserForm;
