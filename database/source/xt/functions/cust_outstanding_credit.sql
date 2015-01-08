create or replace function xt.cust_outstanding_credit(cust_id integer, applicable_currency integer, applicable_date date) returns numeric stable as $$
-- sum of all unallocated credits for a customer
    -- TODO: subtract cash receipts pending

-- second convert the currency of the receivable to the currency of the invoice
SELECT COALESCE(SUM(currToCurr(aropen_curr_id, $2,
  unallocated, $3)),0) AS amount
from (
  -- select distinct on allows us to add the aggregated aropenalloc_amount column
  -- without having to inner join a temporarily grouped table
  select distinct on (aropen_id) aropen_id, aropen_cust_id, aropen_curr_id,
  coalesce(aropen_amount, 0) - 
    -- first convert the currency of the allocation to the currency of the receivable
    COALESCE(SUM(currToCurr(aropenalloc_curr_id, aropen_curr_id,
    aropenalloc_amount, aropen_duedate)),0) AS unallocated
  from aropen
  left join aropenalloc on aropen_id = aropenalloc_aropen_id
  where aropen_cust_id = $1
  and aropen_open
  --and aropen_posted = false
  group by aropen_id, aropen_cust_id, aropen_curr_id, aropen_amount
) unalloc;

$$ language sql;
