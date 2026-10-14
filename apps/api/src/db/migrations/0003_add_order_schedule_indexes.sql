CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

CREATE INDEX IF NOT EXISTS orders_pending_transition_idx
  ON orders(next_transition_at)
  WHERE next_transition_at IS NOT NULL
    AND status NOT IN ('DELIVERED', 'CANCELLED');
