-- Fix missing unique constraint on customers table
ALTER TABLE public.customers ADD CONSTRAINT unique_customer_user_id UNIQUE (user_id);