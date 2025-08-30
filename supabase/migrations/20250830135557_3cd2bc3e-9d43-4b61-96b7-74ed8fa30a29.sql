-- Create demo accounts with predefined roles and sample data
-- First, let's create the demo user accounts in the profiles table

-- Insert demo profiles (these will be referenced by the auth system)
INSERT INTO public.profiles (id, email, full_name, role, organization, bio, location, phone, created_at, updated_at, last_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'hospital_demo@clinibuilds.com', 'Demo Hospital Admin', 'hospital', 'City General Hospital', 'Demo hospital administrator account for testing purposes', 'New York, NY', '+1-555-0101', now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'investor_demo@clinibuilds.com', 'Demo Investor', 'investor', 'MedTech Ventures', 'Demo investor account for testing purposes', 'San Francisco, CA', '+1-555-0102', now(), now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'manufacturer_demo@clinibuilds.com', 'Demo Manufacturer', 'manufacturer', 'MedEquip Solutions', 'Demo manufacturer account for testing purposes', 'Boston, MA', '+1-555-0103', now(), now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Create demo equipment for hospital
INSERT INTO public.equipment (id, name, manufacturer, category, condition, status, location, description, model, specs, price, lease_rate, owner_id, created_at, updated_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MRI Scanner Pro', 'Siemens Healthcare', 'Imaging', 'Excellent', 'Available', 'Radiology Department', 'High-resolution MRI scanner for detailed imaging', 'Magnetom Vida', '3T magnetic field, 70cm bore', 2500000.00, 15000.00, '11111111-1111-1111-1111-111111111111', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Digital X-Ray System', 'GE Healthcare', 'Imaging', 'Good', 'In Use', 'Emergency Department', 'Digital radiography system for emergency use', 'Discovery XR656', 'Wireless detector, 17x17 inch', 180000.00, 1200.00, '11111111-1111-1111-1111-111111111111', now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ventilator Advanced', 'Medtronic', 'Respiratory', 'Excellent', 'Available', 'ICU', 'Advanced mechanical ventilator for critical care', 'PB980', 'Invasive/non-invasive ventilation', 45000.00, 400.00, '11111111-1111-1111-1111-111111111111', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  manufacturer = EXCLUDED.manufacturer,
  category = EXCLUDED.category,
  condition = EXCLUDED.condition,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  description = EXCLUDED.description,
  model = EXCLUDED.model,
  specs = EXCLUDED.specs,
  price = EXCLUDED.price,
  lease_rate = EXCLUDED.lease_rate,
  owner_id = EXCLUDED.owner_id,
  updated_at = now();

-- Create demo equipment for manufacturer
INSERT INTO public.manufacturer_shops (id, manufacturer_id, name, description, country, status, created_at, updated_at) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'MedEquip Solutions Store', 'Demo manufacturer shop showcasing medical equipment', 'USA', 'active', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  country = EXCLUDED.country,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.equipment (id, name, manufacturer, category, condition, status, location, description, model, specs, price, sales_option, shop_id, owner_id, created_at, updated_at) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ultrasound Scanner Premium', 'MedEquip Solutions', 'Imaging', 'New', 'Available', 'Manufacturing Facility', 'Premium ultrasound system for clinical diagnostics', 'UltraVision Pro', '4D imaging, 15-inch display', 125000.00, 'sale', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', now(), now()),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Patient Monitor Elite', 'MedEquip Solutions', 'Monitoring', 'New', 'Available', 'Manufacturing Facility', 'Multi-parameter patient monitoring system', 'VitalWatch Elite', '5-parameter monitoring, wireless', 35000.00, 'lease', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  manufacturer = EXCLUDED.manufacturer,
  category = EXCLUDED.category,
  condition = EXCLUDED.condition,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  description = EXCLUDED.description,
  model = EXCLUDED.model,
  specs = EXCLUDED.specs,
  price = EXCLUDED.price,
  sales_option = EXCLUDED.sales_option,
  shop_id = EXCLUDED.shop_id,
  owner_id = EXCLUDED.owner_id,
  updated_at = now();

-- Create demo investments for investor
INSERT INTO public.investments (id, investor_id, equipment_id, amount, roi, term, status, notes, created_at, updated_at) VALUES
  ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 500000.00, 12.5, '24 months', 'active', 'Investment in MRI scanner for City General Hospital', now(), now()),
  ('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 25000.00, 8.0, '12 months', 'active', 'Investment in ventilator equipment', now(), now())
ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  roi = EXCLUDED.roi,
  term = EXCLUDED.term,
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = now();

-- Create demo bookings for hospital
INSERT INTO public.bookings (id, user_id, equipment_id, start_time, end_time, status, price_paid, notes, created_at, updated_at) VALUES
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now() + interval '1 day', now() + interval '2 days', 'confirmed', 15000.00, 'Scheduled MRI scan for patient diagnostics', now(), now()),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', now() + interval '3 days', now() + interval '10 days', 'pending', 0.00, 'Ventilator booking for ICU expansion', now(), now())
ON CONFLICT (id) DO UPDATE SET
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  status = EXCLUDED.status,
  price_paid = EXCLUDED.price_paid,
  notes = EXCLUDED.notes,
  updated_at = now();

-- Create demo orders
INSERT INTO public.orders (id, user_id, equipment_id, amount, payment_method, shipping_address, status, notes, created_at, updated_at) VALUES
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 125000.00, 'bank_transfer', '123 Hospital Ave, New York, NY 10001', 'processing', 'Ultrasound scanner purchase for cardiology department', now(), now())
ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  payment_method = EXCLUDED.payment_method,
  shipping_address = EXCLUDED.shipping_address,
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = now();

-- Create a function to generate demo login sessions
CREATE OR REPLACE FUNCTION public.generate_demo_session(demo_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  demo_user_id uuid;
  session_data jsonb;
BEGIN
  -- Get the demo user ID
  SELECT id INTO demo_user_id 
  FROM public.profiles 
  WHERE email = demo_email;
  
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'Demo user not found for email: %', demo_email;
  END IF;
  
  -- Return session data that can be used for demo purposes
  session_data := jsonb_build_object(
    'user_id', demo_user_id,
    'email', demo_email,
    'role', (SELECT role FROM public.profiles WHERE id = demo_user_id),
    'expires_at', extract(epoch from (now() + interval '1 hour')),
    'demo_mode', true
  );
  
  -- Log the demo session creation
  PERFORM public.log_audit_event(
    'DEMO_SESSION_CREATED',
    'demo_session',
    demo_user_id::text,
    null,
    jsonb_build_object('demo_email', demo_email, 'created_by', auth.uid())
  );
  
  RETURN session_data;
END;
$$;