create or replace function xt.invc_allocated_credit(id integer, curr_id integer, order_date date) returns numeric stable as $$
  SELECT COALESCE(SUM(currToCurr(aropenalloc_curr_id, $2,
  aropenalloc_amount, $3)),0) AS amount
  FROM aropenalloc, aropen
  WHERE ( (aropenalloc_doctype='I')
  AND (aropenalloc_doc_id=$1)
  AND (aropenalloc_aropen_id=aropen_id) );   
$$ language sql;
