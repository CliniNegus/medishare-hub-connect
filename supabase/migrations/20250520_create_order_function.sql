
-- Create a function to insert an order and return it
CREATE OR REPLACE FUNCTION public.create_order(order_data JSONB)
RETURNS SETOF public.orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.orders(
    equipment_id,
    user_id,
    amount,
    payment_method,
    shipping_address,
    notes,
    status
  )
  VALUES (
    (order_data->>'equipment_id')::UUID,
    (order_data->>'user_id')::UUID,
    (order_data->>'amount')::NUMERIC,
    order_data->>'payment_method',
    order_data->>'shipping_address',
    order_data->>'notes',
    COALESCE(order_data->>'status', 'pending')
  )
  RETURNING *;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_order(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB) TO anon;
