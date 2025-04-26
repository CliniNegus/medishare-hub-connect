
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from '@/contexts/UserRoleContext';

// This component shows a notification indicator for admins when there are pending support requests
const HelpNotificationIndicator = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const { user } = useAuth();
  const { role } = useUserRole();
  
  useEffect(() => {
    if (!user || role !== 'admin') return;
    
    // Initial fetch
    fetchPendingRequestsCount();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('support_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_requests' },
        () => {
          fetchPendingRequestsCount();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role]);
  
  const fetchPendingRequestsCount = async () => {
    if (!user || role !== 'admin') return;
    
    try {
      const { count, error } = await supabase
        .from('support_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (error) throw error;
      
      setPendingCount(count || 0);
    } catch (error) {
      console.error('Error fetching pending support requests:', error);
    }
  };
  
  if (pendingCount === 0 || role !== 'admin') return null;
  
  return (
    <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {pendingCount > 9 ? '9+' : pendingCount}
    </div>
  );
};

export default HelpNotificationIndicator;
