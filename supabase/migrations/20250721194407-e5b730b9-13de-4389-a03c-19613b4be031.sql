-- Create a customers table to store detailed customer shipping information
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipping_addresses table for storing multiple addresses per customer
CREATE TABLE public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  zip_code TEXT,
  full_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhance orders table with shipping information
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES public.shipping_addresses(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_full_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_phone_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_email TEXT;

-- Enable RLS on new tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers table
CREATE POLICY "Users can view their own customer records" 
ON public.customers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customer records" 
ON public.customers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer records" 
ON public.customers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all customer records" 
ON public.customers 
FOR ALL 
USING (is_admin());

-- Create RLS policies for shipping_addresses table
CREATE POLICY "Users can view their own shipping addresses" 
ON public.shipping_addresses 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.customers 
  WHERE customers.id = shipping_addresses.customer_id 
  AND customers.user_id = auth.uid()
));

CREATE POLICY "Users can create their own shipping addresses" 
ON public.shipping_addresses 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.customers 
  WHERE customers.id = shipping_addresses.customer_id 
  AND customers.user_id = auth.uid()
));

CREATE POLICY "Users can update their own shipping addresses" 
ON public.shipping_addresses 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.customers 
  WHERE customers.id = shipping_addresses.customer_id 
  AND customers.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own shipping addresses" 
ON public.shipping_addresses 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.customers 
  WHERE customers.id = shipping_addresses.customer_id 
  AND customers.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all shipping addresses" 
ON public.shipping_addresses 
FOR ALL 
USING (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_shipping_addresses_customer_id ON public.shipping_addresses(customer_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_shipping_address_id ON public.orders(shipping_address_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at
BEFORE UPDATE ON public.shipping_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle customer and shipping address creation
CREATE OR REPLACE FUNCTION public.create_or_update_customer_with_shipping(
  p_user_id UUID,
  p_full_name TEXT,
  p_phone_number TEXT,
  p_email TEXT,
  p_street TEXT,
  p_city TEXT,
  p_country TEXT,
  p_zip_code TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  customer_uuid UUID;
  shipping_address_uuid UUID;
  full_address_text TEXT;
BEGIN
  -- Create full address text
  full_address_text := p_street || ', ' || p_city || ', ' || p_country;
  IF p_zip_code IS NOT NULL AND p_zip_code != '' THEN
    full_address_text := full_address_text || ' ' || p_zip_code;
  END IF;

  -- Insert or update customer
  INSERT INTO public.customers (user_id, full_name, phone_number, email)
  VALUES (p_user_id, p_full_name, p_phone_number, p_email)
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number,
    email = EXCLUDED.email,
    updated_at = now()
  RETURNING id INTO customer_uuid;

  -- If no customer_uuid from INSERT/UPDATE, find existing one
  IF customer_uuid IS NULL THEN
    SELECT id INTO customer_uuid FROM public.customers WHERE user_id = p_user_id;
  END IF;

  -- Insert shipping address
  INSERT INTO public.shipping_addresses (
    customer_id, full_name, phone_number, street, city, country, zip_code, full_address, is_default
  ) VALUES (
    customer_uuid, p_full_name, p_phone_number, p_street, p_city, p_country, p_zip_code, full_address_text, true
  ) RETURNING id INTO shipping_address_uuid;

  -- Set all other addresses for this customer as non-default
  UPDATE public.shipping_addresses 
  SET is_default = false 
  WHERE customer_id = customer_uuid AND id != shipping_address_uuid;

  RETURN shipping_address_uuid;
END;
$$;