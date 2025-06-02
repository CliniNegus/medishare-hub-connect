
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function HelpNotificationIndicator() {
  const { user } = useAuth();

  const { data: unreadCount } = useQuery({
    queryKey: ['unreadSupportRequests', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      try {
        const { count, error } = await supabase
          .from('support_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'open');

        if (error) {
          console.error('Error fetching support request count:', error);
          return 0;
        }
        
        return count || 0;
      } catch (error) {
        console.error('Error in support request query:', error);
        return 0;
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  if (!unreadCount || unreadCount === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  );
}
