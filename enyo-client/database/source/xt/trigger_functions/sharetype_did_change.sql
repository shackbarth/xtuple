create or replace function xt.sharetype_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

 var sql,
   rows,
   ary = [];

 rows = plv8.execute("select * from xt.sharetype");

 if (rows.length) {
   rows.forEach(function (row) {
     sql = "select " +
       row.sharetype_col_obj_uuid + " as obj_uuid," +
       row.sharetype_col_username + " as username " +
       "from " + row.sharetype_nsname + "." + row.sharetype_tblname + " ";
     ary.push(sql);
   });

   sql = "select xt.create_view('xt.share_users','" + ary.join(" union all ") + "', true)";
   plv8.execute(sql);

 }

 return NEW;

}());

$$ language plv8;
