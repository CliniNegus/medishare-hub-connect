
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define form schema
const userFormSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  organization: z.string().min(1, { message: "Organization is required" }),
  phone: z.string().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded?: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  open, 
  onOpenChange,
  onUserAdded
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      role: "",
      organization: "",
      phone: "",
      password: generatePassword(10),
    }
  });

  // Generate a random password
  function generatePassword(length: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(10);
    form.setValue('password', newPassword);
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create user in auth system
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            role: values.role,
            organization: values.organization
          }
        }
      });
      
      if (authError) throw authError;
      
      // The profile will be created automatically via the database trigger
      
      toast({
        title: "User Added Successfully",
        description: `${values.full_name} has been added as a ${values.role}`,
      });
      
      form.reset({
        full_name: "",
        email: "",
        role: "",
        organization: "",
        phone: "",
        password: generatePassword(10),
      });
      
      onOpenChange(false);
      
      if (onUserAdded) {
        onUserAdded();
      }
      
    } catch (error: any) {
      console.error('Error adding user:', error.message);
      toast({
        title: "Failed to add user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Add New User</DialogTitle>
          <DialogDescription>
            Enter the details to create a new user account.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGeneratePassword} 
                className="mb-[1px]"
              >
                Generate
              </Button>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#E02020] hover:bg-[#E02020]/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
