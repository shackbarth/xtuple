create or replace function xt.invc_allocated_credit(invchead) returns numeric stable as $$
  SELECT COALESCE(SUM(currToCurr(aropenalloc_curr_id, $1.invchead_curr_id,
  aropenalloc_amount, $1.invchead_orderdate)),0) AS amount
  FROM aropenalloc, aropen
  WHERE ( (aropenalloc_doctype='I')
  AND (aropenalloc_doc_id=$1.invchead_id)
  AND (aropenalloc_aropen_id=aropen_id) );   
$$ language sql;
