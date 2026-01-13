-- Fix ALL foreign keys referencing profiles table to allow user deletion

-- clients.organization_id
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_organization_id_fkey;
ALTER TABLE public.clients ADD CONSTRAINT clients_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- deletion_requests.reviewed_by
ALTER TABLE public.deletion_requests DROP CONSTRAINT IF EXISTS deletion_requests_reviewed_by_fkey;
ALTER TABLE public.deletion_requests ADD CONSTRAINT deletion_requests_reviewed_by_fkey 
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- equipment.owner_id (THIS IS THE CURRENT ERROR)
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_owner_id_fkey;
ALTER TABLE public.equipment ADD CONSTRAINT equipment_owner_id_fkey 
  FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- leases.investor_id
ALTER TABLE public.leases DROP CONSTRAINT IF EXISTS leases_investor_id_fkey;
ALTER TABLE public.leases ADD CONSTRAINT leases_investor_id_fkey 
  FOREIGN KEY (investor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- leases.hospital_id
ALTER TABLE public.leases DROP CONSTRAINT IF EXISTS leases_hospital_id_fkey;
ALTER TABLE public.leases ADD CONSTRAINT leases_hospital_id_fkey 
  FOREIGN KEY (hospital_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- maintenance.created_by
ALTER TABLE public.maintenance DROP CONSTRAINT IF EXISTS maintenance_created_by_fkey;
ALTER TABLE public.maintenance ADD CONSTRAINT maintenance_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- profiles.deletion_initiated_by (self-reference)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_deletion_initiated_by_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_deletion_initiated_by_fkey 
  FOREIGN KEY (deletion_initiated_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- admin_actions.admin_id - make nullable if not already
ALTER TABLE public.admin_actions ALTER COLUMN admin_id DROP NOT NULL;
ALTER TABLE public.admin_actions DROP CONSTRAINT IF EXISTS admin_actions_admin_id_fkey;
ALTER TABLE public.admin_actions ADD CONSTRAINT admin_actions_admin_id_fkey 
  FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE SET NULL;