
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddProductModal from './AddProductModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createEquipmentImagesBucket } from '@/integrations/supabase/createStorageBucket';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

interface EquipmentManagementProps {
  recentEquipment: Equipment[];
}

const EquipmentManagement = ({ recentEquipment: initialEquipment }: EquipmentManagementProps) => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [equipment, setEquipment] = useState(initialEquipment);
  const { toast } = useToast();
  const [bucketReady, setBucketReady] = useState(false);

  // Create/check bucket when component mounts
  useEffect(() => {
    const checkBucket = async () => {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        toast({
          title: "Storage Setup Error",
          description: "Failed to set up image storage. Some features may not work correctly.",
          variant: "destructive",
        });
      }
    };
    
    checkBucket();
  }, []);

  // Fetch equipment data when refresh trigger changes
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from('equipment')
          .select('*');
          
        if (error) throw error;
        
        // Transform data for display - handle missing manufacturer field
        const formattedEquipment = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          // Use a fallback for manufacturer since it's not in the database schema
          manufacturer: item.category || 'Unknown', 
          status: item.status || 'Unknown',
          location: 'Warehouse' // Default location, update as needed
        }));
        
        setEquipment(formattedEquipment);
      } catch (error: any) {
        console.error('Error fetching equipment:', error);
        toast({
          title: "Error",
          description: "Failed to fetch equipment data",
          variant: "destructive",
        });
      }
    };
    
    fetchEquipment();
  }, [refreshTrigger]);

  const handleAddEquipmentClick = async () => {
    // Create bucket if needed before opening modal
    if (!bucketReady) {
      const result = await createEquipmentImagesBucket();
      setBucketReady(result);
      if (!result) {
        toast({
          title: "Storage Setup Error",
          description: "Failed to set up image storage. Some features may not work correctly.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsAddProductModalOpen(true);
  };

  const handleProductAdded = () => {
    // Increment trigger to refresh the equipment list
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Success",
      description: "Product added successfully", 
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Equipment Management</h2>
        <Button 
          onClick={handleAddEquipmentClick}
          className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Equipment
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Equipment Categories</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Imaging Equipment (42 items)</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">MRI Scanners, CT Scanners, X-Ray Machines, Ultrasound Devices</p>
              <Button variant="outline" size="sm">View All</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Patient Monitoring (38 items)</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Patient Monitors, ECG Machines, Vital Signs Monitors</p>
              <Button variant="outline" size="sm">View All</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Laboratory Equipment (25 items)</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Analyzers, Centrifuges, Microscopes, Lab Automation Systems</p>
              <Button variant="outline" size="sm">View All</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Surgical Equipment (40 items)</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Surgical Tables, Surgical Lights, Anesthesia Machines</p>
              <Button variant="outline" size="sm">View All</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">All Equipment</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id.substring(0, 8)}...</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.manufacturer}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs 
                  ${item.status === 'Leased' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Available' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-[#E02020] text-[#E02020] hover:bg-red-50">Edit</Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">View</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Product Modal */}
      <AddProductModal
        open={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
        isAdmin={true}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default EquipmentManagement;
