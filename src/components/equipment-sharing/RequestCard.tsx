import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Building2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { EquipmentRequest } from '@/hooks/use-equipment-sharing';
import { useAuth } from '@/contexts/AuthContext';

interface RequestCardProps {
  request: EquipmentRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const RequestCard = ({ request, onApprove, onReject, onCancel }: RequestCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === request.owning_hospital_id;
  const isRequester = user?.id === request.requesting_hospital_id;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: <Clock className="h-3 w-3" /> },
      approved: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: <XCircle className="h-3 w-3" /> },
      cancelled: { color: 'bg-muted text-muted-foreground', icon: <XCircle className="h-3 w-3" /> },
      active: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      in_transit: { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: <Clock className="h-3 w-3" /> },
      completed: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
    };
    const variant = variants[status] || variants.pending;
    
    return (
      <Badge variant="outline" className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      normal: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    
    return (
      <Badge variant="outline" className={colors[urgency] || colors.normal}>
        {urgency === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {request.equipment?.name || 'Equipment'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {request.equipment?.manufacturer}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(request.status)}
            {getUrgencyBadge(request.urgency)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <div>
              <p className="text-xs">
                {isOwner ? 'Requested by' : 'Owner'}
              </p>
              <p className="font-medium text-foreground">
                {isOwner 
                  ? request.requesting_hospital?.organization || request.requesting_hospital?.full_name 
                  : request.owning_hospital?.organization || request.owning_hospital?.full_name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="text-xs">Duration</p>
              <p className="font-medium text-foreground">
                {format(new Date(request.start_date), 'MMM d')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {request.purpose && (
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">{request.purpose}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {request.request_type.charAt(0).toUpperCase() + request.request_type.slice(1)}
          </Badge>
          <span>•</span>
          <span>Requested {format(new Date(request.created_at), 'MMM d, yyyy')}</span>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            {isOwner && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove?.(request.id)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onReject?.(request.id)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {isRequester && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onCancel?.(request.id)}
                className="flex-1"
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}

        {request.response_notes && request.status !== 'pending' && (
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-xs text-muted-foreground mb-1">Response</p>
            <p>{request.response_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
