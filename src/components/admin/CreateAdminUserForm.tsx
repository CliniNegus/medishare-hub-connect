
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the validation schema
const adminFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

const CreateAdminUserForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const handleCreateAdmin = async (values: AdminFormValues) => {
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      
      console.log("Creating admin user with params:", {
        email: values.email,
        fullName: values.fullName
      });

      // Call the Supabase RPC function to create an admin user
      const { data, error: rpcError } = await supabase.rpc(
        'create_admin_user',
        {
          admin_email: values.email,
          admin_password: values.password,
          full_name: values.fullName || null
        }
      );

      if (rpcError) {
        console.error("Error creating admin user via RPC:", rpcError);
        throw new Error(`Failed to create admin user: ${rpcError.message}`);
      }
      
      console.log("Admin user created with ID:", data);
      
      // After successful creation, attempt to sign in with the created credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (signInError) {
        console.error("Admin created but sign-in failed:", signInError);
        setSuccess(`Admin user created successfully. ID: ${data}. Please sign in manually.`);
      } else {
        // Redirect to admin dashboard on successful sign in
        window.location.href = '/admin';
        return;
      }
      
      toast({
        title: "Admin user created",
        description: `Successfully created admin user: ${values.email}`,
      });
      
      // Reset form
      form.reset();
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
    <Card className="border border-red-600 shadow-md">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="text-xl text-red-600">Create Admin User</CardTitle>
        <CardDescription>
          Create a new user with administrator privileges
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateAdmin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      id="admin-full-name"
                      type="text"
                      placeholder="Full Name"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Password (min. 8 characters)"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
              {loading ? "Creating..." : "Create Admin User"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUserForm;
