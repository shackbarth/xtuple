create or replace function xt.obj_type_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

 var sql,
   rows,
   ary = [];

 rows = plv8.execute("select * from xt.obj_type");

 if (rows.length) {
   rows.forEach(function (row) {
     sql = "select " +
       "''" + row.obj_type_tblname + "''::text as tblname," +
       row.obj_type_col_obj_uuid + " as obj_uuid " +
       "from " + row.obj_type_nsname + "." + row.obj_type_tblname + " ";
     ary.push(sql);
   });

   sql = "select xt.create_view('xt.obj_uuid','" + ary.join(" union all ") + "', true)";
   plv8.execute(sql);

 }

 return NEW;

}());

$$ language plv8;
