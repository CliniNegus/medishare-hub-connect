
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Hospital, Factory, PiggyBank } from "lucide-react";
import { useUserRole, UserRole } from '@/contexts/UserRoleContext';

interface ChangeAccountTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangeAccountTypeModal: React.FC<ChangeAccountTypeModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { profile, role, updateUserRole } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (selectedRole === profile?.role) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateUserRole(selectedRole);
      
      toast({
        title: "Account type updated",
        description: `Your account has been updated to ${selectedRole}.`,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Failed to update account type",
        description: error.message || "An error occurred while updating your account type.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Account Type</DialogTitle>
          <DialogDescription>
            Select the type of account you want to use on this platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={selectedRole} 
            onValueChange={(value) => setSelectedRole(value as UserRole)}
            className="grid gap-4"
          >
            <div className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedRole === 'hospital' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
              <RadioGroupItem value="hospital" id="hospital" className={selectedRole === 'hospital' ? 'text-red-600' : ''} />
              <Label htmlFor="hospital" className="flex items-center cursor-pointer">
                <Hospital className="h-5 w-5 mr-2 text-red-600" />
                <div>
                  <p className="font-medium">Hospital</p>
                  <p className="text-sm text-gray-500">For healthcare providers</p>
                </div>
              </Label>
            </div>
            
            <div className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedRole === 'manufacturer' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
              <RadioGroupItem value="manufacturer" id="manufacturer" className={selectedRole === 'manufacturer' ? 'text-red-600' : ''} />
              <Label htmlFor="manufacturer" className="flex items-center cursor-pointer">
                <Factory className="h-5 w-5 mr-2 text-red-600" />
                <div>
                  <p className="font-medium">Manufacturer</p>
                  <p className="text-sm text-gray-500">For equipment suppliers</p>
                </div>
              </Label>
            </div>
            
            <div className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedRole === 'investor' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
              <RadioGroupItem value="investor" id="investor" className={selectedRole === 'investor' ? 'text-red-600' : ''} />
              <Label htmlFor="investor" className="flex items-center cursor-pointer">
                <PiggyBank className="h-5 w-5 mr-2 text-red-600" />
                <div>
                  <p className="font-medium">Investor</p>
                  <p className="text-sm text-gray-500">For financial backers</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || selectedRole === profile?.role}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Updating..." : "Change Account Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAccountTypeModal;
