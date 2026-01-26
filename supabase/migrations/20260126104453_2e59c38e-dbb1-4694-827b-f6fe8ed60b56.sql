-- Add more equipment for Dr. Krish's manufacturer account (using valid status values)
INSERT INTO public.equipment (name, category, manufacturer, status, price, quantity, location, description, owner_id, usage_hours, downtime_hours, revenue_generated, condition, model, specs, sales_option, image_url) VALUES
('Cardiac Monitor Pro 500', 'Monitoring', 'Medics Co.', 'available', 850000, 25, 'Nairobi, Kenya', 'Advanced cardiac monitoring system with 12-lead ECG capability', '21faec06-aebb-4608-9a3f-d87ebd562414', 1250, 45, 4500000, 'New', 'CMP-500', '12-lead ECG, SpO2, NIBP, Temperature monitoring', 'Lease', NULL),
('Portable Ultrasound X3', 'Imaging', 'Medics Co.', 'leased', 2500000, 12, 'Mombasa, Kenya', 'Compact portable ultrasound with high-resolution imaging', '21faec06-aebb-4608-9a3f-d87ebd562414', 890, 22, 3200000, 'New', 'PUX-3', 'Color Doppler, 3D/4D imaging, wireless connectivity', 'Sale', NULL),
('Ventilator VT-2000', 'Respiratory', 'Medics Co.', 'available', 1800000, 18, 'Nairobi, Kenya', 'ICU-grade ventilator with advanced respiratory support', '21faec06-aebb-4608-9a3f-d87ebd562414', 2100, 85, 6800000, 'New', 'VT-2000', 'Volume and pressure control, SIMV, CPAP, BiPAP modes', 'Lease', NULL),
('Defibrillator AED Plus', 'Emergency', 'Medics Co.', 'available', 450000, 35, 'Kisumu, Kenya', 'Automated external defibrillator with CPR feedback', '21faec06-aebb-4608-9a3f-d87ebd562414', 320, 8, 1500000, 'New', 'AED-Plus', 'Real CPR Help, fast shock delivery, pediatric mode', 'Sale', NULL),
('Surgical Light SL-800', 'Surgical', 'Medics Co.', 'maintenance', 1200000, 8, 'Nakuru, Kenya', 'LED surgical light with shadow-free illumination', '21faec06-aebb-4608-9a3f-d87ebd562414', 1800, 120, 2100000, 'Good', 'SL-800', '160,000 lux, color temperature adjustment, camera integration', 'Lease', NULL),
('Patient Infusion Pump', 'IV Therapy', 'Medics Co.', 'available', 280000, 50, 'Nairobi, Kenya', 'Smart infusion pump with drug library', '21faec06-aebb-4608-9a3f-d87ebd562414', 4500, 35, 2800000, 'New', 'IP-200', 'Drug error reduction, wireless connectivity, stackable design', 'Sale', NULL),
('Blood Gas Analyzer', 'Laboratory', 'Medics Co.', 'leased', 950000, 6, 'Eldoret, Kenya', 'Point-of-care blood gas analysis system', '21faec06-aebb-4608-9a3f-d87ebd562414', 1650, 28, 1900000, 'New', 'BGA-100', 'pH, pCO2, pO2, electrolytes, metabolites', 'Lease', NULL),
('Digital X-Ray System', 'Imaging', 'Medics Co.', 'available', 8500000, 4, 'Nairobi, Kenya', 'Full digital radiography system with DR detector', '21faec06-aebb-4608-9a3f-d87ebd562414', 980, 42, 8200000, 'New', 'DXR-5000', 'High resolution detector, automatic exposure control, PACS integration', 'Financing', NULL),
('Anesthesia Machine AM-3000', 'Anesthesia', 'Medics Co.', 'available', 3200000, 7, 'Mombasa, Kenya', 'Advanced anesthesia workstation', '21faec06-aebb-4608-9a3f-d87ebd562414', 1420, 55, 4100000, 'New', 'AM-3000', 'Electronic flowmeters, integrated monitoring, ventilator modes', 'Lease', NULL),
('Sterilizer Autoclave Pro', 'Sterilization', 'Medics Co.', 'available', 680000, 15, 'Nairobi, Kenya', 'High-capacity steam sterilizer', '21faec06-aebb-4608-9a3f-d87ebd562414', 3200, 95, 1600000, 'New', 'SAP-500', 'Pre-vacuum cycle, automatic door, documentation system', 'Sale', NULL);

-- Insert orders for Dr. Krish's equipment from various hospitals
INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '20e51232-f803-4a88-8047-479e4fd4c495',
  850000,
  'invoice',
  'Kenyatta National Hospital, Nairobi, Kenya',
  'Urgent requirement for cardiac ICU',
  'completed',
  NOW() - INTERVAL '45 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Cardiac Monitor Pro 500'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '33b85c49-fcc0-4f2a-9420-9c4d428f56b2',
  2500000,
  'credit',
  'Coast General Hospital, Mombasa, Kenya',
  'For radiology department expansion',
  'completed',
  NOW() - INTERVAL '30 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Portable Ultrasound X3'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '317134af-8457-4395-a41a-a90587be55de',
  1800000,
  'invoice',
  'Aga Khan Hospital, Kisumu, Kenya',
  'ICU ventilator upgrade',
  'processing',
  NOW() - INTERVAL '7 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Ventilator VT-2000'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '488c8b60-9987-4a27-a17c-cabfec01f665',
  450000,
  'wallet',
  'Nairobi Hospital, Nairobi, Kenya',
  'Emergency room equipment',
  'completed',
  NOW() - INTERVAL '60 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Defibrillator AED Plus'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '2ccbcb72-1382-4717-83e5-e4192a889a05',
  8500000,
  'invoice',
  'MP Shah Hospital, Nairobi, Kenya',
  'New diagnostic imaging center',
  'pending',
  NOW() - INTERVAL '3 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Digital X-Ray System'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '20e51232-f803-4a88-8047-479e4fd4c495',
  280000,
  'credit',
  'Kenyatta National Hospital, Nairobi, Kenya',
  'Ward expansion - 10 units needed',
  'completed',
  NOW() - INTERVAL '20 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Patient Infusion Pump'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '33b85c49-fcc0-4f2a-9420-9c4d428f56b2',
  3200000,
  'invoice',
  'Coast General Hospital, Mombasa, Kenya',
  'Operating theater equipment',
  'shipped',
  NOW() - INTERVAL '12 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Anesthesia Machine AM-3000'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '317134af-8457-4395-a41a-a90587be55de',
  680000,
  'wallet',
  'Aga Khan Hospital, Kisumu, Kenya',
  'Sterilization department upgrade',
  'completed',
  NOW() - INTERVAL '55 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Sterilizer Autoclave Pro'
LIMIT 1;

-- Add more orders with existing equipment (ECL8000)
INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '20e51232-f803-4a88-8047-479e4fd4c495',
  3500000,
  'invoice',
  'Kenyatta National Hospital, Nairobi, Kenya',
  'Laboratory equipment purchase',
  'completed',
  NOW() - INTERVAL '40 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'ECL8000'
LIMIT 1;

INSERT INTO public.orders (equipment_id, user_id, amount, payment_method, shipping_address, notes, status, created_at) 
SELECT 
  e.id,
  '488c8b60-9987-4a27-a17c-cabfec01f665',
  3500000,
  'credit',
  'Nairobi Hospital, Nairobi, Kenya',
  'Pathology lab expansion',
  'completed',
  NOW() - INTERVAL '25 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'ECL8000'
LIMIT 1;

-- Insert equipment analytics data
INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 85, 3, 425000, 'Nairobi, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Cardiac Monitor Pro 500';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 72, 5, 380000, 'Nairobi, Kenya', NOW() - INTERVAL '2 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Cardiac Monitor Pro 500';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 68, 4, 350000, 'Nairobi, Kenya', NOW() - INTERVAL '3 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Cardiac Monitor Pro 500';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 90, 2, 520000, 'Mombasa, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Portable Ultrasound X3';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 110, 8, 680000, 'Nairobi, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Ventilator VT-2000';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 95, 4, 590000, 'Nairobi, Kenya', NOW() - INTERVAL '3 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Ventilator VT-2000';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 45, 1, 180000, 'Kisumu, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Defibrillator AED Plus';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 120, 15, 350000, 'Nakuru, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Surgical Light SL-800';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 200, 5, 420000, 'Nairobi, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Patient Infusion Pump';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 88, 3, 290000, 'Eldoret, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Blood Gas Analyzer';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 65, 6, 850000, 'Nairobi, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Digital X-Ray System';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 78, 4, 520000, 'Mombasa, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Anesthesia Machine AM-3000';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 180, 12, 280000, 'Nairobi, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Sterilizer Autoclave Pro';

-- Analytics for existing ECL8000
INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 145, 8, 1200000, 'Nairobi, Kenya', NOW() - INTERVAL '1 day'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'ECL8000';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 132, 5, 980000, 'Nairobi, Kenya', NOW() - INTERVAL '2 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'ECL8000';

INSERT INTO public.equipment_analytics (equipment_id, usage_hours, downtime_hours, revenue_generated, last_location, date_recorded)
SELECT e.id, 128, 6, 1050000, 'Nairobi, Kenya', NOW() - INTERVAL '3 days'
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'ECL8000';

-- Insert maintenance records
INSERT INTO public.maintenance (equipment_id, maintenance_type, status, scheduled_date, description, priority, created_by, technician_name, estimated_duration)
SELECT e.id, 'preventive', 'scheduled', NOW() + INTERVAL '7 days', 'Routine calibration and inspection', 'medium', '21faec06-aebb-4608-9a3f-d87ebd562414', 'John Kamau', 4
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Cardiac Monitor Pro 500';

INSERT INTO public.maintenance (equipment_id, maintenance_type, status, scheduled_date, description, priority, created_by, technician_name, estimated_duration)
SELECT e.id, 'corrective', 'in_progress', NOW() - INTERVAL '1 day', 'LED replacement and recalibration', 'high', '21faec06-aebb-4608-9a3f-d87ebd562414', 'Peter Ochieng', 6
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Surgical Light SL-800';

INSERT INTO public.maintenance (equipment_id, maintenance_type, status, scheduled_date, completed_date, description, priority, created_by, technician_name, estimated_duration, actual_duration)
SELECT e.id, 'preventive', 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', 'Annual service and software update', 'medium', '21faec06-aebb-4608-9a3f-d87ebd562414', 'Mary Wanjiku', 8, 7
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Ventilator VT-2000';

INSERT INTO public.maintenance (equipment_id, maintenance_type, status, scheduled_date, description, priority, created_by, technician_name, estimated_duration)
SELECT e.id, 'preventive', 'scheduled', NOW() + INTERVAL '14 days', 'Probe calibration and image quality check', 'low', '21faec06-aebb-4608-9a3f-d87ebd562414', 'David Mwangi', 3
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'Portable Ultrasound X3';

INSERT INTO public.maintenance (equipment_id, maintenance_type, status, scheduled_date, completed_date, description, priority, created_by, technician_name, estimated_duration, actual_duration)
SELECT e.id, 'preventive', 'completed', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', 'Full system calibration', 'medium', '21faec06-aebb-4608-9a3f-d87ebd562414', 'John Kamau', 6, 5
FROM equipment e WHERE e.owner_id = '21faec06-aebb-4608-9a3f-d87ebd562414' AND e.name = 'ECL8000';