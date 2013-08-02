create or replace function xt.po_receive_all(pohead_id integer) returns integer as $$
/* Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  var result = plv8.execute("select public.enterporeceipt(poitem_id, poitem_qty_ordered) from poitem where ( (poitem_status <> 'C') and (poitem_pohead_id=$1));", [pohead_id])[0].result;
  return result;

$$ language plv8;
