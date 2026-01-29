import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { Equipment } from '@/hooks/useEquipmentManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import EquipmentViewModal from './EquipmentViewModal';
import EquipmentEditModal from './EquipmentEditModal';
import EquipmentTableMobile from './EquipmentTableMobile';
import VisibilityControl, { VisibilityBadge, VisibilityStatus } from './VisibilityControl';

interface EquipmentTableProps {
  equipment: Equipment[];
  loading: boolean;
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => Promise<Equipment>;
}

const EquipmentTable = ({ equipment, loading, onUpdateEquipment }: EquipmentTableProps) => {
  const { user, userRoles } = useAuth();
  const isMobile = useIsMobile();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if user can edit equipment (admin or owner)
  const canEditEquipment = (item: Equipment) => {
    return userRoles.isAdmin || item.owner_id === user?.id;
  };

  const handleViewEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsViewModalOpen(true);
  };

  const handleEditEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsEditModalOpen(true);
  };

  const getStatusBadgeColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'leased':
        return 'bg-purple-100 text-purple-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out of service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateId = (id: string) => {
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading equipment...</span>
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No equipment found. Add some equipment to get started.
      </div>
    );
  }

  return (
    <>
      {/* Mobile view - Card layout */}
      {isMobile ? (
        <EquipmentTableMobile 
          equipment={equipment}
          onViewEquipment={handleViewEquipment}
          onEditEquipment={handleEditEquipment}
        />
      ) : (
        /* Desktop view - Table layout */
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px] w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[18%] min-w-[120px]">Equipment</TableHead>
                <TableHead className="w-[14%] min-w-[100px]">Manufacturer</TableHead>
                <TableHead className="w-[12%] min-w-[90px]">Status</TableHead>
                <TableHead className="w-[14%] min-w-[100px]">Location</TableHead>
                {userRoles.isAdmin && <TableHead className="w-[130px]">Visibility</TableHead>}
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {truncateId(item.id)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-[150px]" title={item.name}>
                    {item.name}
                  </TableCell>
                  <TableCell className="truncate max-w-[120px]" title={item.manufacturer || 'Unknown'}>
                    {item.manufacturer || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeColor(item.status)} whitespace-nowrap text-xs`}>
                      {item.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="truncate max-w-[120px]" title={item.location || 'Not specified'}>
                    {item.location || 'Not specified'}
                  </TableCell>
                  {userRoles.isAdmin && (
                    <TableCell className="p-2">
                      <VisibilityControl
                        itemId={item.id}
                        itemType="equipment"
                        currentVisibility={item.visibility_status}
                        itemName={item.name}
                        onVisibilityChange={() => {
                          // Refresh handled internally
                        }}
                        compact
                      />
                    </TableCell>
                  )}
                  <TableCell className="p-2">
                    <div className="flex gap-1">
                      {/* Only show edit button if user can edit this equipment */}
                      {canEditEquipment(item) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#E02020] text-[#E02020] hover:bg-red-50 px-2 h-7 text-xs"
                          onClick={() => handleEditEquipment(item)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-300 hover:bg-gray-50 px-2 h-7 text-xs"
                        onClick={() => handleViewEquipment(item)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Modal */}
      <EquipmentViewModal
        equipment={selectedEquipment}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />

      {/* Edit Modal */}
      <EquipmentEditModal
        equipment={selectedEquipment}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={onUpdateEquipment}
      />
    </>
  );
};

export default EquipmentTable;
