import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, MapPin, Package } from 'lucide-react';
import { 
  getEquipmentById, 
  getMovementsByEquipment, 
  getFacilityById 
} from '@/data/clusterMapDemoData';

interface EquipmentMovementModalProps {
  equipmentId: string | null;
  onClose: () => void;
}

const getMovementStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Completed</Badge>;
    case 'In Progress':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">In Progress</Badge>;
    case 'Scheduled':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">Scheduled</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'Pending';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EquipmentMovementModal: React.FC<EquipmentMovementModalProps> = ({
  equipmentId,
  onClose,
}) => {
  const equipment = equipmentId ? getEquipmentById(equipmentId) : null;
  const movements = equipmentId ? getMovementsByEquipment(equipmentId) : [];

  return (
    <Dialog open={!!equipmentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Equipment Movement History
          </DialogTitle>
          <DialogDescription>
            {equipment ? equipment.name : 'Loading...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No movement history available</p>
            </div>
          ) : (
            movements.map((movement, index) => {
              const fromFacility = getFacilityById(movement.from_facility_id);
              const toFacility = getFacilityById(movement.to_facility_id);

              return (
                <div
                  key={movement.id}
                  className="relative bg-muted/30 rounded-lg p-4"
                >
                  {/* Timeline connector */}
                  {index < movements.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-border" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {getMovementStatusBadge(movement.status)}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateTime(movement.started_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">From</span>
                          </div>
                          <div className="font-medium truncate">
                            {fromFacility?.name || 'Unknown'}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">To</span>
                          </div>
                          <div className="font-medium truncate">
                            {toFacility?.name || 'Unknown'}
                          </div>
                        </div>
                      </div>

                      {movement.completed_at && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Completed: {formatDateTime(movement.completed_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentMovementModal;
