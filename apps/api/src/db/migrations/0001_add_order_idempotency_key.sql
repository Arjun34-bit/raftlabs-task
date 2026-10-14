-- Applies the idempotency change directly to an existing orders table.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS idempotency_key varchar(100);

CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_idx
  ON orders(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
