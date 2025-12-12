import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'manufacturer' | 'hospital' | 'investor';

interface UserRolesState {
  roles: AppRole[];
  primaryRole: AppRole | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export function useUserRoles(userId: string | null) {
  const [state, setState] = useState<UserRolesState>({
    roles: [],
    primaryRole: null,
    isAdmin: false,
    loading: true,
    error: null,
  });

  const fetchUserRoles = useCallback(async () => {
    if (!userId) {
      setState({
        roles: [],
        primaryRole: null,
        isAdmin: false,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return;
      }

      const roles = (data?.map(r => r.role) || []) as AppRole[];
      const isAdmin = roles.includes('admin');
      
      // Priority order for primary role: admin > manufacturer > hospital > investor
      const rolePriority: AppRole[] = ['admin', 'manufacturer', 'hospital', 'investor'];
      const primaryRole = rolePriority.find(r => roles.includes(r)) || null;

      setState({
        roles,
        primaryRole,
        isAdmin,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Error in fetchUserRoles:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  const hasRole = useCallback((role: AppRole): boolean => {
    return state.roles.includes(role);
  }, [state.roles]);

  const addRole = useCallback(async (role: AppRole): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        // Ignore duplicate key errors
        if (error.code === '23505') {
          return true;
        }
        console.error('Error adding role:', error);
        return false;
      }

      await fetchUserRoles();
      return true;
    } catch (err) {
      console.error('Error in addRole:', err);
      return false;
    }
  }, [userId, fetchUserRoles]);

  const removeRole = useCallback(async (role: AppRole): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        console.error('Error removing role:', error);
        return false;
      }

      await fetchUserRoles();
      return true;
    } catch (err) {
      console.error('Error in removeRole:', err);
      return false;
    }
  }, [userId, fetchUserRoles]);

  return {
    ...state,
    hasRole,
    addRole,
    removeRole,
    refetch: fetchUserRoles,
  };
}
