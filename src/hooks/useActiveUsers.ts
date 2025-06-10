
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ActiveUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
  organization: string | null;
  last_active: string | null;
}

export const useActiveUsers = () => {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ActiveUser>('last_active');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, role, organization, last_active')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%,organization.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<ActiveUser>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      // Refresh the users list
      await fetchUsers();
      
      toast({
        title: "User updated successfully",
        description: "The user information has been updated.",
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSort = (field: keyof ActiveUser) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Set up real-time subscription for profile updates
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          // Refresh users when any profile changes
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchTerm, sortField, sortDirection]);

  // Set up periodic user activity updates
  useEffect(() => {
    // Update current user's last_active timestamp periodically
    const updateUserActivity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.rpc('update_user_last_active', { user_uuid: user.id });
        }
      } catch (error) {
        console.error('Error updating user activity:', error);
      }
    };

    // Update activity immediately
    updateUserActivity();

    // Set up interval to update activity every 5 minutes
    const activityInterval = setInterval(updateUserActivity, 5 * 60 * 1000);

    return () => {
      clearInterval(activityInterval);
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, sortField, sortDirection]);

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    updateUser,
    refreshUsers: fetchUsers
  };
};
