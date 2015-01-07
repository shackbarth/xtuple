create or replace function xt.co_allocated_credit(cohead) returns numeric stable as $$
  SELECT COALESCE(SUM(currToCurr(aropenalloc_curr_id, $1.cohead_curr_id,
  aropenalloc_amount, $1.cohead_orderdate)),0) AS amount
  FROM aropenalloc, aropen
  WHERE ( (aropenalloc_doctype='S')
  AND (aropenalloc_doc_id=$1.cohead_id)
  AND (aropenalloc_aropen_id=aropen_id) );   
$$ language sql;
