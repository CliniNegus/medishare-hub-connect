
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { ButtonLoader } from "@/components/ui/loader";

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
  const [showPassword, setShowPassword] = useState(false);

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
      
      // Call the function without explicit type parameters, let TypeScript infer it
      const { data, error } = await supabase.rpc('create_admin_user', params);

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="shadow-md border-border">
      <CardHeader className="bg-secondary/5 border-b border-border">
        <CardTitle className="text-xl text-primary">Create Admin User</CardTitle>
        <CardDescription>
          Create a new user with administrative privileges
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-full-name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="admin-full-name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-border"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={loading}
          >
            {loading ? (
              <>
                <ButtonLoader /> Creating...
              </>
            ) : (
              "Create Admin User"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUserForm;
