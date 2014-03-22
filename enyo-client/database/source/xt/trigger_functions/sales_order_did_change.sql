create or replace function xt.sales_order_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

   var data = Object.create(XT.Data),
     sqlUpdate = "update quhead set quhead_status = 'C' where quhead_id=$1",
     sqlDelete = "perform deletequote($1);",
     sql,
     orm,
     id;

   /* Handle quote disposition if this is a new sales order converted from a quote */
   if (TG_OP === 'INSERT' &&
       NEW.cohead_wasquote &&
       NEW.cohead_quote_number) {
    orm = data.fetchOrm("XM", "Quote");
    id = data.getId(orm, NEW.cohead_quote_number);
    sql = data.fetchMetric('ShowQuotesAfterSO') ? sqlUpdate : sqlDelete;
    plv8.execute(sql, [id]);
    return NEW;
   }

}());

$$ language plv8;
