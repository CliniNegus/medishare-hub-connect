import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, Clock, Wrench } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isPast, isToday, addDays } from 'date-fns';

interface EquipmentMaintenanceBadgeProps {
  equipmentId: string;
  onScheduleClick?: () => void;
  compact?: boolean;
}

interface MaintenanceInfo {
  id: string;
  scheduled_date: string;
  status: string;
  priority: string;
  maintenance_type: string;
  is_overdue: boolean;
}

const EquipmentMaintenanceBadge: React.FC<EquipmentMaintenanceBadgeProps> = ({
  equipmentId,
  onScheduleClick,
  compact = false
}) => {
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceInfo();
  }, [equipmentId]);

  const fetchMaintenanceInfo = async () => {
    try {
      setLoading(true);
      
      // Get the next scheduled maintenance for this equipment
      const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .eq('equipment_id', equipmentId)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setMaintenanceInfo(data);
    } catch (error) {
      console.error('Error fetching maintenance info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaintenanceStatus = () => {
    if (!maintenanceInfo) {
      return {
        type: 'none',
        color: 'bg-gray-100 text-gray-600',
        icon: Calendar,
        text: 'No maintenance scheduled',
        urgent: false
      };
    }

    const scheduledDate = parseISO(maintenanceInfo.scheduled_date);
    const isDue = isPast(scheduledDate);
    const isDueToday = isToday(scheduledDate);
    const isDueSoon = scheduledDate <= addDays(new Date(), 7);

    if (maintenanceInfo.is_overdue || isDue) {
      return {
        type: 'overdue',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: AlertTriangle,
        text: 'Overdue',
        urgent: true
      };
    }

    if (isDueToday) {
      return {
        type: 'today',
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: Clock,
        text: 'Due today',
        urgent: true
      };
    }

    if (isDueSoon) {
      return {
        type: 'soon',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Calendar,
        text: `Due ${format(scheduledDate, 'MMM dd')}`,
        urgent: false
      };
    }

    if (maintenanceInfo.status === 'in_progress') {
      return {
        type: 'progress',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Wrench,
        text: 'In progress',
        urgent: false
      };
    }

    return {
      type: 'scheduled',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: Calendar,
      text: `Scheduled ${format(scheduledDate, 'MMM dd')}`,
      urgent: false
    };
  };

  if (loading) {
    return compact ? (
      <div className="h-5 w-16 bg-gray-200 animate-pulse rounded" />
    ) : (
      <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
    );
  }

  const status = getMaintenanceStatus();
  const Icon = status.icon;

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Badge 
          className={`${status.color} text-xs flex items-center space-x-1 ${status.urgent ? 'animate-pulse' : ''}`}
        >
          <Icon className="h-3 w-3" />
          <span>{status.text}</span>
        </Badge>
        {status.type === 'none' && onScheduleClick && (
          <Button
            size="sm"
            variant="outline"
            onClick={onScheduleClick}
            className="h-6 px-2 text-xs border-[#E02020] text-[#E02020] hover:bg-red-50"
          >
            Schedule
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Badge 
        className={`${status.color} flex items-center space-x-1 w-fit ${status.urgent ? 'animate-pulse' : ''}`}
      >
        <Icon className="h-4 w-4" />
        <span>{status.text}</span>
      </Badge>
      
      {maintenanceInfo && (
        <div className="text-xs text-gray-600">
          <p>Type: {maintenanceInfo.maintenance_type.replace('_', ' ')}</p>
          {maintenanceInfo.priority !== 'medium' && (
            <p>Priority: {maintenanceInfo.priority}</p>
          )}
        </div>
      )}
      
      {status.type === 'none' && onScheduleClick && (
        <Button
          size="sm"
          variant="outline"
          onClick={onScheduleClick}
          className="w-full border-[#E02020] text-[#E02020] hover:bg-red-50"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Schedule Maintenance
        </Button>
      )}
    </div>
  );
};

export default EquipmentMaintenanceBadge;