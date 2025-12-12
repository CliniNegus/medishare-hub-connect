-- Create equipment_requests table for tracking requests between hospitals
CREATE TABLE public.equipment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  requesting_hospital_id UUID NOT NULL,
  owning_hospital_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  request_type TEXT NOT NULL DEFAULT 'borrow',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT,
  notes TEXT,
  urgency TEXT DEFAULT 'normal',
  response_notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed', 'in_transit', 'active')),
  CONSTRAINT valid_request_type CHECK (request_type IN ('borrow', 'lease', 'purchase')),
  CONSTRAINT valid_urgency CHECK (urgency IN ('low', 'normal', 'high', 'critical'))
);

-- Create sharing_agreements table for terms between hospitals
CREATE TABLE public.sharing_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.equipment_requests(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  lender_hospital_id UUID NOT NULL,
  borrower_hospital_id UUID NOT NULL,
  terms TEXT,
  daily_rate NUMERIC DEFAULT 0,
  deposit_amount NUMERIC DEFAULT 0,
  insurance_required BOOLEAN DEFAULT false,
  maintenance_responsibility TEXT DEFAULT 'borrower',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  signed_by_lender BOOLEAN DEFAULT false,
  signed_by_borrower BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_agreement_status CHECK (status IN ('draft', 'active', 'completed', 'terminated', 'disputed'))
);

-- Create equipment_transfers table for transfer records
CREATE TABLE public.equipment_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.equipment_requests(id) ON DELETE CASCADE,
  agreement_id UUID REFERENCES public.sharing_agreements(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  from_hospital_id UUID NOT NULL,
  to_hospital_id UUID NOT NULL,
  transfer_type TEXT NOT NULL DEFAULT 'outgoing',
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  return_scheduled_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  condition_on_pickup TEXT,
  condition_on_delivery TEXT,
  condition_on_return TEXT,
  tracking_number TEXT,
  carrier TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_transfer_type CHECK (transfer_type IN ('outgoing', 'incoming', 'return')),
  CONSTRAINT valid_transfer_status CHECK (status IN ('scheduled', 'picked_up', 'in_transit', 'delivered', 'returned', 'cancelled'))
);

-- Enable RLS
ALTER TABLE public.equipment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sharing_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for equipment_requests
CREATE POLICY "Users can view requests they're involved in"
ON public.equipment_requests FOR SELECT
USING (
  auth.uid() = requesting_hospital_id 
  OR auth.uid() = owning_hospital_id 
  OR is_admin()
);

CREATE POLICY "Users can create requests"
ON public.equipment_requests FOR INSERT
WITH CHECK (auth.uid() = requesting_hospital_id);

CREATE POLICY "Users can update their requests"
ON public.equipment_requests FOR UPDATE
USING (
  auth.uid() = requesting_hospital_id 
  OR auth.uid() = owning_hospital_id 
  OR is_admin()
);

CREATE POLICY "Users can delete their pending requests"
ON public.equipment_requests FOR DELETE
USING (
  (auth.uid() = requesting_hospital_id AND status = 'pending')
  OR is_admin()
);

-- RLS Policies for sharing_agreements
CREATE POLICY "Users can view agreements they're part of"
ON public.sharing_agreements FOR SELECT
USING (
  auth.uid() = lender_hospital_id 
  OR auth.uid() = borrower_hospital_id 
  OR is_admin()
);

CREATE POLICY "Lenders can create agreements"
ON public.sharing_agreements FOR INSERT
WITH CHECK (auth.uid() = lender_hospital_id OR is_admin());

CREATE POLICY "Parties can update agreements"
ON public.sharing_agreements FOR UPDATE
USING (
  auth.uid() = lender_hospital_id 
  OR auth.uid() = borrower_hospital_id 
  OR is_admin()
);

-- RLS Policies for equipment_transfers
CREATE POLICY "Users can view transfers they're involved in"
ON public.equipment_transfers FOR SELECT
USING (
  auth.uid() = from_hospital_id 
  OR auth.uid() = to_hospital_id 
  OR is_admin()
);

CREATE POLICY "Users can create transfers"
ON public.equipment_transfers FOR INSERT
WITH CHECK (
  auth.uid() = from_hospital_id 
  OR auth.uid() = to_hospital_id 
  OR is_admin()
);

CREATE POLICY "Users can update transfers"
ON public.equipment_transfers FOR UPDATE
USING (
  auth.uid() = from_hospital_id 
  OR auth.uid() = to_hospital_id 
  OR is_admin()
);

-- Create indexes for performance
CREATE INDEX idx_equipment_requests_requesting ON public.equipment_requests(requesting_hospital_id);
CREATE INDEX idx_equipment_requests_owning ON public.equipment_requests(owning_hospital_id);
CREATE INDEX idx_equipment_requests_status ON public.equipment_requests(status);
CREATE INDEX idx_sharing_agreements_lender ON public.sharing_agreements(lender_hospital_id);
CREATE INDEX idx_sharing_agreements_borrower ON public.sharing_agreements(borrower_hospital_id);
CREATE INDEX idx_equipment_transfers_from ON public.equipment_transfers(from_hospital_id);
CREATE INDEX idx_equipment_transfers_to ON public.equipment_transfers(to_hospital_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE equipment_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE equipment_transfers;

-- Create trigger for updated_at
CREATE TRIGGER update_equipment_requests_updated_at
  BEFORE UPDATE ON public.equipment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sharing_agreements_updated_at
  BEFORE UPDATE ON public.sharing_agreements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_transfers_updated_at
  BEFORE UPDATE ON public.equipment_transfers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();