
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
      
      const { count, error } = await supabase
        .from('support_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'open');

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  if (!unreadCount) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
      {unreadCount}
    </div>
  );
}
