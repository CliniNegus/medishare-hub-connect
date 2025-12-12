import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Package, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';
import { EquipmentTransfer } from '@/hooks/use-equipment-sharing';
import { useAuth } from '@/contexts/AuthContext';

interface TransferCardProps {
  transfer: EquipmentTransfer;
  onUpdateStatus?: (id: string, status: EquipmentTransfer['status']) => void;
}

export const TransferCard = ({ transfer, onUpdateStatus }: TransferCardProps) => {
  const { user } = useAuth();
  const isFromHospital = user?.id === transfer.from_hospital_id;
  const isToHospital = user?.id === transfer.to_hospital_id;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      scheduled: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <Calendar className="h-3 w-3" /> },
      picked_up: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: <Package className="h-3 w-3" /> },
      in_transit: { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: <Truck className="h-3 w-3" /> },
      delivered: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      returned: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      cancelled: { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: <CheckCircle className="h-3 w-3" /> },
    };
    const variant = variants[status] || variants.scheduled;
    
    return (
      <Badge variant="outline" className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const getNextAction = () => {
    if (transfer.status === 'scheduled' && isFromHospital) {
      return { label: 'Mark as Picked Up', nextStatus: 'picked_up' as const };
    }
    if (transfer.status === 'picked_up') {
      return { label: 'Mark In Transit', nextStatus: 'in_transit' as const };
    }
    if (transfer.status === 'in_transit' && isToHospital) {
      return { label: 'Confirm Delivery', nextStatus: 'delivered' as const };
    }
    if (transfer.status === 'delivered' && isToHospital && transfer.return_scheduled_date) {
      return { label: 'Initiate Return', nextStatus: 'returned' as const };
    }
    return null;
  };

  const nextAction = getNextAction();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {transfer.equipment?.name || 'Equipment Transfer'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {transfer.equipment?.manufacturer}
            </p>
          </div>
          {getStatusBadge(transfer.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">From</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="font-medium">To</span>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Scheduled</span>
            <span className="font-medium">
              {format(new Date(transfer.scheduled_date), 'MMM d, yyyy')}
            </span>
          </div>
          
          {transfer.pickup_date && (
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Picked Up</span>
              <span className="font-medium">
                {format(new Date(transfer.pickup_date), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          )}
          
          {transfer.delivery_date && (
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Delivered</span>
              <span className="font-medium">
                {format(new Date(transfer.delivery_date), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          )}

          {transfer.return_scheduled_date && (
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Return By</span>
              <span className="font-medium">
                {format(new Date(transfer.return_scheduled_date), 'MMM d, yyyy')}
              </span>
            </div>
          )}

          {transfer.tracking_number && (
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Tracking #</span>
              <span className="font-mono text-xs">{transfer.tracking_number}</span>
            </div>
          )}
        </div>

        {transfer.condition_on_pickup && (
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-xs text-muted-foreground mb-1">Condition on Pickup</p>
            <p>{transfer.condition_on_pickup}</p>
          </div>
        )}

        {nextAction && (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onUpdateStatus?.(transfer.id, nextAction.nextStatus)}
          >
            {nextAction.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
