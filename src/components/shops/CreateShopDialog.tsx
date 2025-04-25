
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateShopDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newShop: {
    name: string;
    country: string;
    description: string;
  };
  countries: string[];
  onShopChange: (field: string, value: string) => void;
  onCreateShop: () => Promise<void>;
}

const CreateShopDialog: React.FC<CreateShopDialogProps> = ({
  isOpen,
  onOpenChange,
  newShop,
  countries,
  onShopChange,
  onCreateShop
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" /> Create Shop
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Virtual Shop</DialogTitle>
          <DialogDescription>
            Create a new shop to list and manage medical devices for a specific country.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Kenya Medical Shop" 
              value={newShop.name} 
              onChange={(e) => onShopChange('name', e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Select 
              value={newShop.country} 
              onValueChange={(value) => onShopChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe what this shop offers" 
              value={newShop.description} 
              onChange={(e) => onShopChange('description', e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={onCreateShop}
            disabled={!newShop.name || !newShop.country}
          >
            Create Shop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShopDialog;
