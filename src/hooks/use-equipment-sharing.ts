import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EquipmentRequest {
  id: string;
  equipment_id: string;
  requesting_hospital_id: string;
  owning_hospital_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'in_transit' | 'active';
  request_type: 'borrow' | 'lease' | 'purchase';
  start_date: string;
  end_date: string;
  purpose?: string;
  notes?: string;
  urgency: 'low' | 'normal' | 'high' | 'critical';
  response_notes?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  equipment?: {
    id: string;
    name: string;
    manufacturer?: string;
    image_url?: string;
    location?: string;
  };
  requesting_hospital?: {
    id: string;
    full_name?: string;
    organization?: string;
  };
  owning_hospital?: {
    id: string;
    full_name?: string;
    organization?: string;
  };
}

export interface SharingAgreement {
  id: string;
  request_id: string;
  equipment_id: string;
  lender_hospital_id: string;
  borrower_hospital_id: string;
  terms?: string;
  daily_rate: number;
  deposit_amount: number;
  insurance_required: boolean;
  maintenance_responsibility: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed' | 'terminated' | 'disputed';
  signed_by_lender: boolean;
  signed_by_borrower: boolean;
  created_at: string;
}

export interface EquipmentTransfer {
  id: string;
  request_id: string;
  agreement_id?: string;
  equipment_id: string;
  from_hospital_id: string;
  to_hospital_id: string;
  transfer_type: 'outgoing' | 'incoming' | 'return';
  status: 'scheduled' | 'picked_up' | 'in_transit' | 'delivered' | 'returned' | 'cancelled';
  scheduled_date: string;
  pickup_date?: string;
  delivery_date?: string;
  return_scheduled_date?: string;
  return_date?: string;
  condition_on_pickup?: string;
  condition_on_delivery?: string;
  tracking_number?: string;
  carrier?: string;
  notes?: string;
  created_at: string;
  equipment?: {
    id: string;
    name: string;
    manufacturer?: string;
  };
}

export const useEquipmentSharing = () => {
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [agreements, setAgreements] = useState<SharingAgreement[]>([]);
  const [transfers, setTransfers] = useState<EquipmentTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('equipment_requests')
        .select(`
          *,
          equipment:equipment_id (id, name, manufacturer, image_url, location),
          requesting_hospital:requesting_hospital_id (id, full_name, organization),
          owning_hospital:owning_hospital_id (id, full_name, organization)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data as unknown as EquipmentRequest[]) || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchAgreements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sharing_agreements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgreements((data as SharingAgreement[]) || []);
    } catch (error: any) {
      console.error('Error fetching agreements:', error);
    }
  };

  const fetchTransfers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('equipment_transfers')
        .select(`
          *,
          equipment:equipment_id (id, name, manufacturer)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setTransfers((data as unknown as EquipmentTransfer[]) || []);
    } catch (error: any) {
      console.error('Error fetching transfers:', error);
    }
  };

  const createRequest = async (requestData: {
    equipment_id: string;
    owning_hospital_id: string;
    request_type: 'borrow' | 'lease' | 'purchase';
    start_date: string;
    end_date: string;
    purpose?: string;
    notes?: string;
    urgency?: 'low' | 'normal' | 'high' | 'critical';
  }) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('equipment_requests')
        .insert({
          ...requestData,
          requesting_hospital_id: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Request Submitted',
        description: 'Your equipment request has been sent for approval.',
      });

      await fetchRequests();
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const respondToRequest = async (
    requestId: string,
    status: 'approved' | 'rejected',
    responseNotes?: string
  ) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('equipment_requests')
        .update({
          status,
          response_notes: responseNotes,
          responded_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      if (status === 'approved') {
        // Create transfer record when approved
        const request = requests.find(r => r.id === requestId);
        if (request) {
          await supabase.from('equipment_transfers').insert({
            request_id: requestId,
            equipment_id: request.equipment_id,
            from_hospital_id: request.owning_hospital_id,
            to_hospital_id: request.requesting_hospital_id,
            transfer_type: 'outgoing',
            scheduled_date: request.start_date,
            return_scheduled_date: request.end_date,
          });
        }
      }

      toast({
        title: status === 'approved' ? 'Request Approved' : 'Request Rejected',
        description: status === 'approved' 
          ? 'The equipment request has been approved.' 
          : 'The equipment request has been rejected.',
      });

      await fetchRequests();
      await fetchTransfers();
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const updateTransferStatus = async (
    transferId: string,
    status: EquipmentTransfer['status'],
    additionalData?: Partial<EquipmentTransfer>
  ) => {
    try {
      const updateData: any = { status, ...additionalData };
      
      if (status === 'picked_up') {
        updateData.pickup_date = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivery_date = new Date().toISOString();
      } else if (status === 'returned') {
        updateData.return_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('equipment_transfers')
        .update(updateData)
        .eq('id', transferId);

      if (error) throw error;

      toast({
        title: 'Transfer Updated',
        description: `Transfer status updated to ${status.replace('_', ' ')}.`,
      });

      await fetchTransfers();
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('equipment_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Request Cancelled',
        description: 'Your equipment request has been cancelled.',
      });

      await fetchRequests();
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRequests(), fetchAgreements(), fetchTransfers()]);
      setLoading(false);
    };

    loadData();

    // Real-time subscriptions
    const requestsChannel = supabase
      .channel('equipment-requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment_requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    const transfersChannel = supabase
      .channel('equipment-transfers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment_transfers' }, () => {
        fetchTransfers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(transfersChannel);
    };
  }, [user]);

  return {
    requests,
    agreements,
    transfers,
    loading,
    createRequest,
    respondToRequest,
    updateTransferStatus,
    cancelRequest,
    refetch: () => Promise.all([fetchRequests(), fetchAgreements(), fetchTransfers()]),
  };
};
