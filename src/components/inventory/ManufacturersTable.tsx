
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Manufacturer } from '@/models/inventory';
import { useToast } from '@/hooks/use-toast';
import ManufacturersTableSearch from './components/ManufacturersTableSearch';
import ManufacturersTableHeader from './components/ManufacturersTableHeader';
import ManufacturersTableRow from './components/ManufacturersTableRow';
import ManufacturersTableEmpty from './components/ManufacturersTableEmpty';
import ManufacturersTableLoading from './components/ManufacturersTableLoading';
import { useManufacturersData } from './hooks/useManufacturersData';

interface ManufacturersTableProps {
  manufacturers: Manufacturer[];
  onViewManufacturer: (id: string) => void;
}

const ManufacturersTable: React.FC<ManufacturersTableProps> = ({ 
  manufacturers: propManufacturers, 
  onViewManufacturer 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { manufacturers, loading } = useManufacturersData(propManufacturers);

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

  if (loading) {
    return <ManufacturersTableLoading />;
  }

  return (
    <div className="space-y-6">
      <ManufacturersTableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalManufacturers={manufacturers.length}
        filteredCount={filteredManufacturers.length}
      />

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <ManufacturersTableHeader />
          <TableBody>
            {filteredManufacturers.length === 0 ? (
              <ManufacturersTableEmpty />
            ) : (
              filteredManufacturers.map((manufacturer) => (
                <ManufacturersTableRow
                  key={manufacturer.id}
                  manufacturer={manufacturer}
                  onViewManufacturer={onViewManufacturer}
                  onContact={handleContact}
                />
              ))
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
