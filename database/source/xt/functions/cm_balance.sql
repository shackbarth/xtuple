create or replace function xt.cm_balance(cmhead_id integer, cmhead_freight numeric, 
    cmhead_misc numeric, cmhead_curr_id integer, cmhead_docdate date,
    cmhead_cust_id integer, cmhead_invcnumber text) returns numeric stable as $$
  select GREATEST(0.0, COALESCE(xt.cm_total($1, $2, $3), 0) 
    - COALESCE(xt.invc_allocated_credit($1, $4, $5), 0)
    - COALESCE(xt.cust_outstanding_credit($6, $4, $5), 0)
    - COALESCE(xt.invc_authorized_credit($7), 0)
    ) as balance; 
$$ language sql;

