import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import EquipmentHeader from "@/components/admin/equipment/EquipmentHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  manufacturer: string | null;
  category: string | null;
  location: string | null;
  price: number | null;
  quantity: number | null;
  image_url: string | null;
  status: string | null;
  created_at: string;
}

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        console.log('Raw equipment data:', data);
        
        // Explicitly map the fields to ensure type safety
        const typedData: Equipment[] = data.map(item => ({
          id: item.id,
          name: item.name,
          manufacturer: item.manufacturer || null,
          category: item.category || null,
          location: item.location || null,
          price: item.price || null,
          quantity: item.quantity || null,
          image_url: item.image_url || null,
          status: item.status || null,
          created_at: item.created_at
        }));
        
        setEquipment(typedData);
      } else {
        setEquipment([]);
      }
    } catch (error: any) {
      console.error('Error fetching equipment:', error.message);
      toast({
        title: "Failed to load equipment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipmentClick = () => {
    console.log("Navigating to add equipment page from EquipmentManagement");
    navigate('/add-equipment');
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <main className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Equipment Management</h1>
          <Button 
            onClick={handleAddEquipmentClick}
            className="bg-[#E02020] hover:bg-[#E02020]/90 text-white font-bold"
            size="lg"
            variant="primary-red"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Equipment
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-[#FFFFFF]">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-[#333333]">Equipment Inventory</CardTitle>
              <Button
                onClick={handleAddEquipmentClick}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020]"></div>
              </div>
            ) : equipment.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.manufacturer || '-'}</TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell>{item.location || '-'}</TableCell>
                      <TableCell>{item.price ? `Ksh ${item.price.toLocaleString()}` : '-'}</TableCell>
                      <TableCell>{item.quantity || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${item.status === 'Available' ? 'bg-green-100 text-green-800' : 
                            item.status === 'Leased' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {item.status || 'Unknown'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No equipment found. Add your first equipment item!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EquipmentManagement;
