create or replace function xt.invc_outstanding_credit(invchead) returns numeric stable as $$
  SELECT 0.0
  -- sum of all unallocated credits, not including cash receipts pending
$$ language sql;
