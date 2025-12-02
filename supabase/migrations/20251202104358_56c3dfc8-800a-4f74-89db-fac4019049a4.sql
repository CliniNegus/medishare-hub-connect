-- Add RLS policies to allow manufacturers to view and manage orders for their equipment

-- Allow manufacturers to view orders for equipment they own directly
CREATE POLICY "Manufacturers can view orders for their equipment"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.equipment
    WHERE equipment.id = orders.equipment_id
    AND equipment.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.equipment
    JOIN public.manufacturer_shops ON equipment.shop_id = manufacturer_shops.id
    WHERE equipment.id = orders.equipment_id
    AND manufacturer_shops.manufacturer_id = auth.uid()
  )
);

-- Allow manufacturers to update order status for their equipment
CREATE POLICY "Manufacturers can update orders for their equipment"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.equipment
    WHERE equipment.id = orders.equipment_id
    AND equipment.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.equipment
    JOIN public.manufacturer_shops ON equipment.shop_id = manufacturer_shops.id
    WHERE equipment.id = orders.equipment_id
    AND manufacturer_shops.manufacturer_id = auth.uid()
  )
);