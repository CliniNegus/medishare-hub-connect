
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Eye, Edit } from "lucide-react";
import { Manufacturer } from '@/models/inventory';
import { useToast } from '@/hooks/use-toast';

interface ManufacturersTableProps {
  manufacturers: Manufacturer[];
  onViewManufacturer: (id: string) => void;
}

const ManufacturersTable: React.FC<ManufacturersTableProps> = ({ 
  manufacturers, 
  onViewManufacturer 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContact = (manufacturer: Manufacturer, type: 'email' | 'phone') => {
    if (type === 'email') {
      window.open(`mailto:${manufacturer.email}`, '_blank');
    } else {
      window.open(`tel:${manufacturer.phone}`, '_blank');
    }
    
    toast({
      title: "Contact Initiated",
      description: `Opening ${type} for ${manufacturer.name}`,
    });
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    toast({
      title: "Edit Manufacturer",
      description: `Editing ${manufacturer.name} details...`,
    });
    // Here you would implement edit functionality
  };

  const getActivityStatus = (itemsLeased: number) => {
    if (itemsLeased === 0) return { color: 'bg-gray-100 text-gray-800', label: 'Inactive' };
    if (itemsLeased < 5) return { color: 'bg-yellow-100 text-yellow-800', label: 'Low Activity' };
    return { color: 'bg-green-100 text-green-800', label: 'Active' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search manufacturers..." 
            className="pl-10 min-w-[300px]" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredManufacturers.length} of {manufacturers.length} manufacturers
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-[#333333]">Manufacturer</TableHead>
              <TableHead className="font-semibold text-[#333333]">Contact Information</TableHead>
              <TableHead className="text-center font-semibold text-[#333333]">Items Leased</TableHead>
              <TableHead className="text-center font-semibold text-[#333333]">Status</TableHead>
              <TableHead className="text-right font-semibold text-[#333333]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredManufacturers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">No manufacturers found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredManufacturers.map((manufacturer) => {
                const activityStatus = getActivityStatus(manufacturer.itemsLeased);
                return (
                  <TableRow 
                    key={manufacturer.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onViewManufacturer(manufacturer.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img 
                            src={manufacturer.logo} 
                            alt={manufacturer.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-logo.png';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#333333]">{manufacturer.name}</div>
                          <div className="text-sm text-gray-500">{manufacturer.contactPerson}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{manufacturer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{manufacturer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-bold text-[#333333]">
                          {manufacturer.itemsLeased}
                        </span>
                        <span className="text-xs text-gray-500">items</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Badge className={`${activityStatus.color} hover:${activityStatus.color}`}>
                        {activityStatus.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onViewManufacturer(manufacturer.id);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleContact(manufacturer, 'email');
                          }}
                          className="hover:bg-green-50 hover:text-green-600"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleContact(manufacturer, 'phone');
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                          title="Call"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleEdit(manufacturer);
                          }}
                          className="hover:bg-yellow-50 hover:text-yellow-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredManufacturers.length > 0 && (
        <div className="text-sm text-gray-600 px-2">
          Total active partnerships: {filteredManufacturers.filter(m => m.itemsLeased > 0).length}
        </div>
      )}
    </div>
  );
};

export default ManufacturersTable;
