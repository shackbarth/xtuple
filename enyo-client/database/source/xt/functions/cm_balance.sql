create or replace function xt.cm_balance(cmhead) returns numeric stable as $$
  select GREATEST(0.0, COALESCE(xt.cm_total($1), 0) 
    - COALESCE(xt.invc_allocated_credit($1.cmhead_id, $1.cmhead_curr_id, $1.cmhead_docdate), 0)
    - COALESCE(xt.invc_outstanding_credit($1.cmhead_cust_id, $1.cmhead_curr_id, $1.cmhead_docdate), 0)
--  - COALESCE(xt.invc_authorized_credit(cmhead_invcnumber), 0)
    ) as balance; 
$$ language sql;

