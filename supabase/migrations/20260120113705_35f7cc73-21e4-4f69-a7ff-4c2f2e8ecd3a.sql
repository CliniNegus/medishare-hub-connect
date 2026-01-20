-- Create catalog upload logs table for audit trail
CREATE TABLE public.catalog_upload_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('csv', 'xlsx')),
  upload_mode TEXT NOT NULL CHECK (upload_mode IN ('add', 'update')),
  catalog_type TEXT NOT NULL CHECK (catalog_type IN ('products', 'equipment')),
  records_created INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  records_skipped INTEGER NOT NULL DEFAULT 0,
  records_failed INTEGER NOT NULL DEFAULT 0,
  error_details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.catalog_upload_logs ENABLE ROW LEVEL SECURITY;

-- Manufacturers can view their own upload logs
CREATE POLICY "Manufacturers can view own upload logs"
ON public.catalog_upload_logs
FOR SELECT
USING (auth.uid() = manufacturer_id);

-- Manufacturers can insert their own upload logs
CREATE POLICY "Manufacturers can insert own upload logs"
ON public.catalog_upload_logs
FOR INSERT
WITH CHECK (auth.uid() = manufacturer_id);

-- Admins can view all upload logs
CREATE POLICY "Admins can view all upload logs"
ON public.catalog_upload_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create index for faster queries
CREATE INDEX idx_catalog_upload_logs_manufacturer ON public.catalog_upload_logs(manufacturer_id);
CREATE INDEX idx_catalog_upload_logs_created_at ON public.catalog_upload_logs(created_at DESC);