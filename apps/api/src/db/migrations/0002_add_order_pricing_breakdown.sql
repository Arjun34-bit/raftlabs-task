ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS platform_fee_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code varchar(30);

UPDATE orders SET
  subtotal_minor = COALESCE(subtotal_minor, total_minor),
  tax_minor = COALESCE(tax_minor, 0),
  platform_fee_minor = COALESCE(platform_fee_minor, 0),
  delivery_fee_minor = COALESCE(delivery_fee_minor, 0),
  discount_minor = COALESCE(discount_minor, 0)
WHERE subtotal_minor IS NULL OR tax_minor IS NULL OR platform_fee_minor IS NULL
  OR delivery_fee_minor IS NULL OR discount_minor IS NULL;

ALTER TABLE orders ALTER COLUMN subtotal_minor SET NOT NULL;
ALTER TABLE orders ALTER COLUMN tax_minor SET NOT NULL;
ALTER TABLE orders ALTER COLUMN platform_fee_minor SET NOT NULL;
ALTER TABLE orders ALTER COLUMN delivery_fee_minor SET NOT NULL;
ALTER TABLE orders ALTER COLUMN discount_minor SET NOT NULL;

ALTER TABLE orders ALTER COLUMN tax_minor SET DEFAULT 0;
ALTER TABLE orders ALTER COLUMN platform_fee_minor SET DEFAULT 0;
ALTER TABLE orders ALTER COLUMN delivery_fee_minor SET DEFAULT 0;
ALTER TABLE orders ALTER COLUMN discount_minor SET DEFAULT 0;
