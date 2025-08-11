-- Create customer_statements table
CREATE TABLE public.customer_statements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  date_range TEXT NOT NULL,
  opening_balance NUMERIC NOT NULL,
  invoiced_amount NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL,
  balance_due NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customer_statements ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage customer statements" 
ON public.customer_statements 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customer_statements_updated_at
BEFORE UPDATE ON public.customer_statements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data
INSERT INTO public.customer_statements (client_name, date_range, opening_balance, invoiced_amount, amount_paid, balance_due)
VALUES 
  ('Kenya Defence Forces Memorial Hospital', 'From 31 Jan 2021 To 31 Dec 2024', 0.0, 2793320.0, 2024920.0, 768400.0),
  ('Kenya Defence Forces Memorial Hospital', 'From 01 Jan 2024 To 31 Dec 2024', 1426320.0, 538000.0, 1195920.0, 768400.0),
  ('AJ Plastic Surgery Ltd', 'From 01 Jan 2025 To 31 Dec 2025', 13000.0, 0.0, 0.0, 13000.0);

-- Enable realtime
ALTER TABLE public.customer_statements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_statements;