
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Correctly define the parameter types for the create_admin_user RPC call
interface CreateAdminParams {
  admin_email: string;
  admin_password: string;
  full_name?: string | null;
}

// Define the return type of the RPC call
type RpcResponse = {
  data: string | null;
  error: Error | null;
}

const CreateAdminUserForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Define params with correct type
      const params: CreateAdminParams = {
        admin_email: email,
        admin_password: password,
        full_name: fullName || null
      };
      
      // Call the function to create an admin user with proper typing
      const { data, error } = await supabase.rpc<string>('create_admin_user', params);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Admin user created",
        description: `Successfully created admin user with ID: ${data}`,
      });
      
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
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
    <Card>
      <CardHeader>
        <CardTitle>Create Admin User</CardTitle>
        <CardDescription>
          Create a new user with admin privileges
        </CardDescription>
      </CardHeader>
      <CardContent>
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
