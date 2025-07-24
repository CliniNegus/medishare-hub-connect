
-- Add pay_per_use fields to equipment table
ALTER TABLE equipment 
ADD COLUMN pay_per_use_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN pay_per_use_price NUMERIC DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN equipment.pay_per_use_enabled IS 'Whether pay-per-use pricing is enabled for this equipment';
COMMENT ON COLUMN equipment.pay_per_use_price IS 'Price per use when pay-per-use is enabled';
